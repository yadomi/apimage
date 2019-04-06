import { parse, validate } from "../helpers/query"
import { getCacheKey } from "../helpers/cache"
import { Request, ResponseToolkit } from "hapi"
import Boom from "boom"
import Sharp from "sharp"
import { has } from "ramda"
import cache from "memory-cache"
import type from "file-type"
import IO from "../helpers/io"
import Config from "../config"

module.exports = async (request: Request, h: ResponseToolkit) => {
	const { query } = request.params
	const [uuid, extension] = request.params.uuid.split(".")

	console.time(uuid)

	/**
	 * Verify on database that requested uuid exist.
	 */
	const db = request.server.app.mongo.db
	const media = await db.collection("media").findOne({ uuid })
	if (!media) {
		throw Boom.notFound("Requested media does not exist in database")
	}

	/**
	 * Verify on storage that requested uuid exist.
	 */
	let buffer: Buffer
	try {
		buffer = await IO.read(uuid)
	} catch (err) {
		if (err.code === "ENOENT") {
			throw Boom.notFound("Requested media does not exist on storage")
		}
		throw Boom.badData("Requested media is corrupt on storage")
	}

	const validated = validate(parse(query, extension))
	if (validated.error) throw Boom.badRequest(validated.error.message.replace(/\[|\]/g, "").replace(/"/g, "`"))
	const transformations = validated.value

	/**
	 * Create a cache key from the transformation object and the uuid.
	 * Then check if cache exist for this key.
	 * If cache exist, we reply with cached data.
	 */
	const cachekey = getCacheKey(uuid, transformations)
	const cached = cache.get(cachekey)
	if (cached) {
		const mimetype = type(cached)
		if (!mimetype) throw Boom.badData()

		console.timeEnd(uuid)
		return h.response(cached).type(mimetype.mime)
	}

	/**
	 * If source is present in query, this mean no transformation is necesary.
	 * We reply with original media as uploaded.
	 */
	if (has("source", transformations) && !transformations.extension) {
		const mimetype = type(buffer)
		if (!mimetype) throw Boom.badData()

		console.timeEnd(uuid)
		return h.response(buffer).type(mimetype.mime)
	}

	/**
	 * Apply each transformation by passing them to Sharp
	 */
	const t = Sharp(buffer)
	if (has("x", transformations) || has("y", transformations)) {
		const metadata = await t.metadata()
		const options: Sharp.Region = {
			left: transformations.x || 0,
			top: transformations.y || 0,
			width: transformations.width || metadata.width || 0,
			height: transformations.height || metadata.height || 0
		}
		t.extract(options)
	}

	if (has("width", transformations) || has("height", transformations)) {
		const options: Sharp.ResizeOptions = {
			width: transformations.width,
			height: transformations.height
		}

		if (has("fit", transformations)) {
			options.fit = transformations.fit
		}

		if (has("position", transformations)) {
			options.position = Sharp.gravity[transformations.position || "center"]
		}

		t.resize(null, null, options)
	}

	if (has("extension", transformations)) {
		const options: Sharp.JpegOptions | Sharp.PngOptions | Sharp.WebpOptions = {}
		if (has("quality", transformations)) {
			options.quality = transformations.quality
		}
		t[transformations.extension || "jpeg"](options)
	}

	const transformed = await t.toBuffer()
	cache.put(cachekey, transformed, Config.cache.ttl)

	const mimetype = type(transformed)
	if (!mimetype) throw Boom.badData()

	console.timeEnd(uuid)
	return h.response(transformed).type(mimetype.mime)
}
