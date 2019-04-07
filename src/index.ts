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
    require('./modules/media/media').default,
  ]);

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
