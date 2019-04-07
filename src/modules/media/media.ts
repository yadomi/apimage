import { PluginBase, PluginPackage } from "hapi"
import pkg from "./package.json"

const plugin: PluginBase<any> & PluginPackage = {
	pkg,
	register: async function(server) {
		server.route({
			method: "GET",
			path: "/media/{publicId}/{query}/{uuid}",
			handler: require("./handlers/read"),
			options: {
				pre: [{ method: require("./handlers/pre/quota").default, assign: "quota" }],
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
	}
}

export default plugin
