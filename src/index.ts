import { REST, Routes, Client, GatewayIntentBits } from "discord.js"
import winston from "winston"

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
})

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

enum CommandNames {
  ping = "ping",
}

const commands = [
  {
    name: CommandNames.ping,
    description: "Replies with Pong!",
  },
]

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN)

;(async () => {
  try {
    logger.debug("Started refreshing application slash commands.")

    await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
      body: commands,
    })

    logger.debug("Successfully reloaded application slash commands.")
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
})()

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.on("ready", () => {
  if (!client.user) {
    logger.error("Client user is not set. This should not happen.")
    process.exit(1)
  }
  logger.info(`Logged in as ${client.user.tag}`)
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === CommandNames.ping) {
    await interaction.reply("Pong!")
    logger.debug("Replied with Pong!")

    // Can access guild from the interaction
    const guild = interaction.guild
    if (!guild) {
      logger.error("Guild is not set. This should not happen.")
      process.exit(1)
    }

    logger.debug(interaction.guild.name)
    logger.debug(interaction.guild.id)
  }
})

client.login(DISCORD_TOKEN).catch((error) => {
  logger.error(error)
  process.exit(1)
})
