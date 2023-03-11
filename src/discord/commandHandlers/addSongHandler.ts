import { ChatInputCommandInteraction } from "discord.js"
import { logger } from "../../logger"

export async function addSongHandler(interaction: ChatInputCommandInteraction) {
  const songText = interaction.options.getString("song")

  if (!songText) {
    await interaction.reply("You didn't provide a song!")
    logger.error("The required song option was not provided")
    return
  }

  await interaction.reply(`You said: ${songText}`)
}
