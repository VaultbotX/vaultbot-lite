import { ChatInputCommandInteraction } from "discord.js"
import { logger } from "../../logger"
import { getSong } from "../../internal/commands/getSong"
import { processSongData } from "../../internal/commands/processSongData"

export async function addSongHandler(interaction: ChatInputCommandInteraction) {
  const songText = interaction.options.getString("song")
  const meta = { interactionId: interaction.id }

  if (!songText) {
    await interaction.reply("You didn't provide a song!")
    logger.error(
      "The required song option was not provided, this should not happen.",
      meta
    )
    return
  }

  const getSongResult = await getSong(songText, meta)
  if (getSongResult.isInvalidInput) {
    await interaction.reply("Invalid song ID or URL provided!")
    return
  }
  if (getSongResult.isSongNotFound) {
    await interaction.reply("Could not find song!")
    return
  }

  if (!getSongResult.song) {
    await interaction.reply("Something went wrong!")
    logger.error(
      "The song was not found, but no error was thrown, this should not happen.",
      meta
    )
    return
  }

  const processSongDataResult = await processSongData(getSongResult.song, meta)
  logger.info(processSongDataResult)

  await interaction.reply("Added song!")
}
