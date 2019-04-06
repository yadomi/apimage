const Hapi = require("hapi")

export const server = Hapi.server({
  port: 3000,
  host: "0.0.0.0",
  debug: { request: ["error"] }
})

server.route({
  method: "GET",
  path: "/{query}/{uuid}",
  handler: require("./handlers/read"),
  options: {
    validate: require("./validators/read")
  }
})

server.route({
  method: "POST",
  path: "/",
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

const main = async () => {
  // prettier-ignore
  await server.register([
    require('./modules/database/database').default,
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
