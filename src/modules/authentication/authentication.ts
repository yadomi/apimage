import { MongoClient, Db } from "mongodb"
import { PluginBase, PluginPackage } from "hapi"
import pkg from "./package.json"
import Boom from "boom"

const plugin: PluginBase<any> & PluginPackage = {
	pkg,
	register: async function(server) {
		server.auth.scheme("public-id", function(server) {
			return {
				authenticate: async function(request, h) {
					const { publicId } = request.params
					if (!publicId) {
						throw Boom.unauthorized("Missing publicId")
					}

					const account = await server.app.mongo.db.collection("account").findOne({ publicId })
					if (!account) {
						throw Boom.unauthorized("Invalid publicId")
					}

					return h.authenticated({ credentials: { user: { publicId } } })
				}
			}
		})

		server.auth.strategy("public-id", "public-id")
	}
}

export default plugin
