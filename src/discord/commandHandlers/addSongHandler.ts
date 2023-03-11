import { ChatInputCommandInteraction } from "discord.js";
import { logger } from "../../logger";
import { getSongWithAudioFeatures } from "../../spotify/commands/getSongWithAudioFeatures";

const spotifyLinkRegex = /^https?:\/\/open.spotify.com\/track\/([a-zA-Z0-9]+)(\?si=[a-zA-Z0-9]+)?$/;
const spotifySongIdRegex = /^[a-zA-Z0-9]+$/;

export async function addSongHandler(interaction: ChatInputCommandInteraction) {
  const songText = interaction.options.getString("song");

  if (!songText) {
    await interaction.reply("You didn't provide a song!");
    logger.error("The required song option was not provided, this should not happen.");
    return;
  }

  let spotifySongId: string | null = null;
  if (spotifyLinkRegex.test(songText)) {
    const match = songText.match(spotifyLinkRegex);
    spotifySongId = match ? match[1] : null;
  } else if (spotifySongIdRegex.test(songText)) {
    spotifySongId = songText;
  } else {
    await interaction.reply("That doesn't look like a valid song!");
    logger.debug(`Invalid song ID or URL provided: ${songText}`);
    return;
  }

  if (!spotifySongId) {
    await interaction.reply("That doesn't look like a valid song!")
    logger.debug(`Attempted to parse song ${songText} but could not find a song id`);
    return;
  }

  const song = await getSongWithAudioFeatures(spotifySongId);
  if (!song) {
    await interaction.reply("I couldn't find that song!");
    logger.debug(`Could not find song ${songText}`);
    return;
  }
}
