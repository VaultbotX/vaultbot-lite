import { REST } from "discord.js"
import { logger } from "./logger"
import { discordClient, refreshSlashCommands } from "./discord"
import { initMongoConnection, initNeo4jConnection } from "./database"
import { initSpotifyClient } from "./spotify"

if (process.env.NODE_ENV !== "production") {
  logger.level = "debug"

  const envPath = require("path").resolve(process.cwd(), ".env")

  require("dotenv").config({
    path: envPath,
  })
  logger.info("Running in development mode")
} else {
  logger.info("Running in production mode")
}

process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down")
  process.exit(0)
})

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down")
  process.exit(0)
})

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", error)
  process.exit(1)
})

const DISCORD_TOKEN = process.env.DISCORD_TOKEN
if (!DISCORD_TOKEN) {
  logger.error("DISCORD_TOKEN is not set")
  process.exit(1)
}

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID
if (!DISCORD_CLIENT_ID) {
  logger.error("DISCORD_CLIENT_ID is not set")
  process.exit(1)
}

const NEO4J_HOST = process.env.NEO4J_HOST
if (!NEO4J_HOST) {
  logger.error("NEO4J_HOST is not set")
  process.exit(1)
}

const NEO4J_AUTH = process.env.NEO4J_AUTH
if (!NEO4J_AUTH) {
  logger.error("NEO4J_AUTH is not set")
  process.exit(1)
}

const MONGO_HOST = process.env.MONGO_HOST
if (!MONGO_HOST) {
  logger.error("MONGO_HOST is not set")
  process.exit(1)
}

const MONGO_INITDB_ROOT_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME
if (!MONGO_INITDB_ROOT_USERNAME) {
  logger.error("MONGO_INITDB_ROOT_USERNAME is not set")
  process.exit(1)
}

const MONGO_INITDB_ROOT_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD
if (!MONGO_INITDB_ROOT_PASSWORD) {
  logger.error("MONGO_INITDB_ROOT_PASSWORD is not set")
  process.exit(1)
}

const MONGO_INITDB_DATABASE = process.env.MONGO_INITDB_DATABASE
if (!MONGO_INITDB_DATABASE) {
  logger.error("MONGO_INITDB_DATABASE is not set")
  process.exit(1)
}

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
if (!SPOTIFY_CLIENT_ID) {
  logger.error("SPOTIFY_CLIENT_ID is not set")
  process.exit(1)
}

const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
if (!SPOTIFY_CLIENT_SECRET) {
  logger.error("SPOTIFY_CLIENT_SECRET is not set")
  process.exit(1)
}

;(async () => {
  await initSpotifyClient()
})()
;(async () => {
  await initNeo4jConnection()
})()
;(async () => {
  await initMongoConnection()
})()
;(async () => {
  const rest: REST = new REST({ version: "10" }).setToken(DISCORD_TOKEN)
  await refreshSlashCommands(DISCORD_CLIENT_ID, rest)
})()

discordClient.login(DISCORD_TOKEN).catch((error) => {
  logger.error(error)
  process.exit(1)
})
