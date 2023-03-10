import { REST, Client, GatewayIntentBits } from "discord.js"
import { logger } from "./logger"
import { onInteraction, onReady, refreshSlashCommands } from "./discord"
import { initDatabaseConnection } from "./database"

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

const DISCORD_TOKEN = process.env.DISCORD_TOKEN
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID

if (!DISCORD_TOKEN) {
  logger.error("DISCORD_TOKEN is not set")
  process.exit(1)
}

if (!DISCORD_CLIENT_ID) {
  logger.error("DISCORD_CLIENT_ID is not set")
  process.exit(1)
}

;(async () => {
  await initDatabaseConnection()
})()

const rest: REST = new REST({ version: "10" }).setToken(DISCORD_TOKEN)

;(async () => {
  await refreshSlashCommands(DISCORD_CLIENT_ID, rest)
})()

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.on("ready", onReady())
client.on("interactionCreate", onInteraction())

client.login(DISCORD_TOKEN).catch((error) => {
  logger.error(error)
  process.exit(1)
})
