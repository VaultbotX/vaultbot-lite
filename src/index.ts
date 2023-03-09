import { REST, Routes, Client, GatewayIntentBits } from "discord.js"
import winston from "winston"

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
})

if (process.env.NODE_ENV !== "production") {
  logger.level = "debug"
  require("dotenv").config({
    path: "../.env",
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

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
]

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN)

;(async () => {
  try {
    console.log("Started refreshing application (/) commands.")

    await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
      body: commands,
    })

    console.log("Successfully reloaded application (/) commands.")
  } catch (error) {
    console.error(error)
  }
})()

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.on("ready", () => {
  if (!client.user) {
    logger.error("Client user is not set")
    process.exit(1)
  }
  logger.info(`Logged in as ${client.user.tag}`)
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!")
  }
})

client.login(DISCORD_TOKEN)
