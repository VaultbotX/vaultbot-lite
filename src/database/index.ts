import neo4j from "neo4j-driver"
import type { Driver } from "neo4j-driver"
import { logger } from "../logger"
import mongoose from "mongoose"

export let neo4jDriver: Driver

function initNeo4jDriver() {
  const NEO4J_HOST = process.env.NEO4J_HOST
  const NEO4J_AUTH = process.env.NEO4J_AUTH

  if (!NEO4J_AUTH || !NEO4J_HOST) {
    logger.error(
      "Neo4j credentials are not set, this should have been handled during startup"
    )
    process.exit(1)
  }

  const username = NEO4J_AUTH.split("/")[0]
  const password = NEO4J_AUTH.split("/")[1]

  neo4jDriver = neo4j.driver(
    `bolt://${NEO4J_HOST}:7687`,
    neo4j.auth.basic(username, password)
  )
}

export async function initNeo4jConnection() {
  initNeo4jDriver()

  const session = neo4jDriver.session()

  try {
    await session.run("MATCH (n) RETURN n LIMIT 1")
    logger.info("Connected to Neo4j database")
  } catch (error) {
    logger.error("Failed to connect to Neo4j database", error)
    process.exit(1)
  } finally {
    await session.close()
    logger.debug("Closed initial Neo4j database session")
  }
}

export let mongoConnection = mongoose

export async function initMongoConnection() {
  const mongoHost = process.env.MONGO_HOST
  if (!mongoHost) {
    logger.error(
      "MongoDB credentials are not set, this should have been handled during startup"
    )
    process.exit(1)
  }

  mongoConnection
    .connect(`mongodb://${mongoHost}:27017`, {
      dbName: process.env.MONGO_INITDB_DATABASE,
      user: process.env.MONGO_INITDB_ROOT_USERNAME,
      pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
    })
    .then(() => {
      logger.info("Connected to MongoDB")
    })
    .catch((err) => {
      logger.error("Failed to connect to MongoDB", err)
    })
}
