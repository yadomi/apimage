import { MongoClient, Db } from "mongodb"

declare module "hapi" {
  export interface ApplicationState {
    mongo: {
      client: MongoClient
      db: Db
    }
  }
}
