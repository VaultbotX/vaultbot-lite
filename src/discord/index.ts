import { logger } from "../logger";
import { Client, Interaction, REST, Routes } from "discord.js";

export enum CommandNames {
  ping = "ping",
}

export const commands = [
  {
    name: CommandNames.ping,
    description: "Replies with Pong!",
  },
]

export async function refreshSlashCommands(clientId: string, rest: REST) {
  try {
    logger.debug("Started refreshing application slash commands");

    await rest.put(Routes.applicationCommands(clientId), {
      body: commands
    });

    logger.debug("Successfully reloaded application slash commands");
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

export function onReady() {
  return (client: Client<true>) => {
    if (!client.user) {
      logger.error("Client user is not set. This should not happen.");
      process.exit(1);
    }
    logger.info(`Logged in as ${client.user.tag}`);
  };
}

export function onInteraction() {
  return async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === CommandNames.ping) {
      await interaction.reply("Pong!");
      logger.debug("Replied with Pong!");

      // Can access guild from the interaction
      const guild = interaction.guild;
      if (!guild) {
        logger.error("Guild is not set. This should not happen.");
        process.exit(1);
      }

      logger.debug(interaction.guild.name);
      logger.debug(interaction.guild.id);
    }
  };
}