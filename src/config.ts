import ms from "ms"

export default {
	database: {
		URL: "mongodb://root:root@localhost:27017",
		dbname: "default"
	},
	storage: {
		base: "/tmp"
	},
	cache: {
		ttl: ms("24h")
	}
}
