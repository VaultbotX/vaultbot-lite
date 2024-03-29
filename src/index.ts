import { REST } from "discord.js"
import { logger } from "./logger"
import { discordClient, refreshSlashCommands } from "./discord"
import { initMongoClient, initNeo4jClient, initRedisClient } from "./database"
import { initSpotifyClient } from "./spotify"
import Bree from "bree";

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

const REDIS_HOST = process.env.REDIS_HOST
if (!REDIS_HOST) {
  logger.error("REDIS_HOST is not set")
  process.exit(1)
}

const REDIS_PASSWORD = process.env.REDIS_PASSWORD
if (!REDIS_PASSWORD) {
  logger.error("REDIS_PASSWORD is not set")
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

const SPOTIFY_PLAYLIST_ID = process.env.SPOTIFY_PLAYLIST_ID
if (!SPOTIFY_PLAYLIST_ID) {
  logger.error("SPOTIFY_PLAYLIST_ID is not set")
  process.exit(1)
}

;(async () => {
  await initSpotifyClient()
})()
;(async () => {
  await initNeo4jClient()
})()
;(async () => {
  await initMongoClient()
})()
;(async () => {
  await initRedisClient()
})()
;(async () => {
  const rest: REST = new REST({ version: "10" }).setToken(DISCORD_TOKEN)
  await refreshSlashCommands(DISCORD_CLIENT_ID, rest)
})()

const bree = new Bree({
  jobs: [
    {
      name: "purgePlaylist",
      cron: "2 * * * *",
      path: "./src/internal/jobs/purgePlaylist.ts",
    }
  ]
})

bree.start()
  .catch((error) => {
    logger.error(error)
    process.exit(1)
  })

discordClient.login(DISCORD_TOKEN).catch((error) => {
  logger.error(error)
  process.exit(1)
})
