import { Snowflake } from "discord.js";
import { logger } from "../../logger";
import { getSongWithAudioFeatures } from "../../spotify/commands/getSongWithAudioFeatures";
import { GetSongResult } from "../types/GetSongResult";

const spotifyLinkRegex = /^https?:\/\/open.spotify.com\/track\/([a-zA-Z0-9]+)(\?si=[a-zA-Z0-9]+)?$/;
const spotifySongIdRegex = /^[a-zA-Z0-9]+$/;

export async function getSong(songText: string, meta: { interactionId: Snowflake }): Promise<GetSongResult> {

  const result: GetSongResult = {}

  let spotifySongId: string | null = null;
  if (spotifyLinkRegex.test(songText)) {
    const match = songText.match(spotifyLinkRegex);
    spotifySongId = match ? match[1] : null;
  } else if (spotifySongIdRegex.test(songText)) {
    spotifySongId = songText;
  } else {
    logger.debug(`Invalid song ID or URL provided: "${songText}"`, meta);
    result.isInvalidInput = true;
    return result;
  }

  if (!spotifySongId) {
    logger.debug(`Attempted to parse song "${songText}" but could not find a song ID`, meta);
    result.isInvalidInput = true;
    return result;
  }

  const song = await getSongWithAudioFeatures(spotifySongId, meta);
  if (!song) {
    logger.debug(`Could not find song "${songText}"`, meta);
    result.isSongNotFound = true;
    return result;
  }

  logger.debug(`Found song "${songText}"`, meta);
  result.song = song;
  return result;
}