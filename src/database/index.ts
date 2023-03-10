import neo4j from "neo4j-driver"
import { logger } from "../logger"

const NEO4J_HOST = process.env.NEO4J_HOST
const NEO4J_USERNAME = process.env.NEO4J_USERNAME
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD

if (!NEO4J_HOST) {
  logger.error("NEO4J_HOST is not set")
  process.exit(1)
}

if (!NEO4J_USERNAME) {
  logger.error("NEO4J_USERNAME is not set")
  process.exit(1)
}

if (!NEO4J_PASSWORD) {
  logger.error("NEO4J_PASSWORD is not set")
  process.exit(1)
}

export const driver = neo4j.driver(
  `bolt://${NEO4J_HOST}:7687`,
  neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
)

export async function initDatabaseConnection() {
  const session = driver.session()

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
