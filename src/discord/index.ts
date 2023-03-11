import { logger } from "../logger"
import { Client, Interaction, REST, Routes } from "discord.js"
import { addSongHandler } from "./commands/addSongHandler"

export enum CommandNames {
  add = "add",
}

export const commands = [
  {
    name: CommandNames.add,
    description: "Adds a song to the dynamic playlist for two weeks",
  },
]

export async function refreshSlashCommands(clientId: string, rest: REST) {
  try {
    logger.debug("Started refreshing application commands")

    rest
      .put(Routes.applicationCommands(clientId), { body: [] })
      .then(() => logger.debug("Successfully deleted all application commands"))
      .catch((error) => {
        logger.error("Failed to delete application commands", error)
        process.exit(1)
      })

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

export function onReady() {
  return (client: Client<true>) => {
    if (!client.user) {
      logger.error("Client user is not set. This should not happen.")
      process.exit(1)
    }
    logger.info(`Logged in as ${client.user.tag}`)
  }
}

export function onInteraction() {
  return async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return
    logger.debug(
      `Received interaction ${interaction.commandName}`,
      interaction.guildId,
      interaction.user.id
    )

    switch (interaction.commandName) {
      case CommandNames.add:
        await addSongHandler(interaction)
        break
    }

    logger.debug(
      `Finished interaction ${interaction.commandName}`,
      interaction.guildId,
      interaction.user.id
    )
  }
}
