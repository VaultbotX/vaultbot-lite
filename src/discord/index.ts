import { logger } from "../logger"
import {
  Client,
  GatewayIntentBits,
  Interaction,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
  SlashCommandBuilder,
} from "discord.js"
import * as path from "path"
import * as fs from "fs"
import { addSongHandler } from "./commandHandlers/addSongHandler"

export enum CommandNames {
  add = "add",
}

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []
const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs.readdirSync(commandsPath)

export const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] })

for (const file of commandFiles) {
  const command: {
    data: SlashCommandBuilder
    execute: Promise<void>
  } = require(`./commands/${file}`)
  commands.push(command.data.toJSON())
}

discordClient.on("ready", onReady())
discordClient.on("interactionCreate", onInteraction())

export async function refreshSlashCommands(clientId: string, rest: REST) {
  try {
    logger.debug("Started refreshing application commands")

    // Only delete commands in production, since we are not limiting to a specific
    // guild in development, this ensures that refreshing is not destructive
    if (process.env.NODE_ENV === "production") {
      rest
        .put(Routes.applicationCommands(clientId), { body: [] })
        .then(() =>
          logger.debug("Successfully deleted all application commands")
        )
        .catch((error) => {
          logger.error("Failed to delete application commands", error)
          process.exit(1)
        })
    }

    rest
      .put(Routes.applicationCommands(clientId), {
        body: commands,
      })
      .then(() => logger.debug("Successfully reloaded application commands"))
      .catch((error) => {
        logger.error("Failed to reload application commands", error)
        process.exit(1)
      })
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

function onReady() {
  return (client: Client<true>) => {
    if (!client.user) {
      logger.error("Client user is not set. This should not happen.")
      process.exit(1)
    }
    logger.info(`Logged in as ${client.user.tag}`)
  }
}

function onInteraction() {
  return async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return
    const meta = {
      guildId: interaction.guildId,
      userId: interaction.user.id,
    }

    logger.debug(`Received interaction ${interaction.commandName}`, meta)

    switch (interaction.commandName) {
      case CommandNames.add:
        await addSongHandler(interaction)
        break
    }

    logger.debug(`Finished interaction ${interaction.commandName}`, meta)
  }
}
