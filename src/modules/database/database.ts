import { MongoClient, Db } from "mongodb"
import Config from "../../config"
import { PluginBase, PluginPackage } from "hapi"
import pkg from "./package.json"

const plugin: PluginBase<any> & PluginPackage = {
  pkg,
  register: async function(server) {
    const client = new MongoClient(Config.database.URL, {
      useNewUrlParser: true
    })
    client.connect(function(err, client) {
      if (err) throw err

      console.log("[MongoDB]", "Connected successfully to server")
      // @ts-ignore
      server.app["mongo"] = {
        client: client,
        db: client.db(Config.database.dbname)
      }
    })

    server.events.on("stop", () => {
      // @ts-ignore
      server.app["mongo"].client.close()
    })
  }
}

export default plugin
