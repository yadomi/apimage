import { ServerResponse } from "http"

const Hapi = require("hapi")

export const server = Hapi.server({
	port: 3000,
	host: "0.0.0.0",
	debug: { request: ["error"] }
})

const main = async () => {
	// prettier-ignore
	await server.register([
    require('./modules/database/database').default,
    require('./modules/authentication/authentication').default,
  ]);

	server.route({
		method: "GET",
		path: "/media/{publicId}/{query}/{uuid}",
		handler: require("./handlers/read"),
		options: {
			auth: {
				strategies: ["public-id"]
			},
			validate: require("./validators/read")
		}
	})

	server.route({
		method: "POST",
		path: "/media",
		handler: require("./handlers/upload"),
		options: {
			validate: require("./validators/upload"),
			payload: {
				output: "stream",
				parse: true,
				allow: "multipart/form-data",
				maxBytes: 1000 * 1000 * 1500 // 15 MB
			}
		}
	})

	await server.start()
	console.log("[Hapi]", `Server running at: ${server.info.uri}`)
}

process.on("unhandledRejection", err => {
	console.error(err)
	process.exit(1)
})

process.on("SIGINT", () => {
	process.exit(0)
})

main()
