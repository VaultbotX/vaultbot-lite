import { Snowflake } from "discord.js"
import { logger } from "../../logger"
import { getSongWithAudioFeatures } from "../../spotify/commands/getSongWithAudioFeatures"
import { GetSongResult } from "../types/GetSongResult"
import { Validity } from "../types/Validity"

const spotifyLinkRegex =
  /^https?:\/\/open.spotify.com\/track\/([a-zA-Z0-9]+)(\?si=[a-zA-Z0-9]+)?$/
const spotifySongIdRegex = /^[a-zA-Z0-9]+$/

export async function getSong(
  songText: string,
  meta: { interactionId: Snowflake }
): Promise<GetSongResult> {
  let spotifySongId: string | null = null
  if (spotifyLinkRegex.test(songText)) {
    const match = songText.match(spotifyLinkRegex)
    spotifySongId = match ? match[1] : null
  } else if (spotifySongIdRegex.test(songText)) {
    spotifySongId = songText
  } else {
    logger.debug(`Invalid song ID or URL provided: "${songText}"`, meta)
  
    return {
      kind: Validity.Invalid,
      isInvalidInput: true
    }
  }

  if (!spotifySongId) {
    logger.debug(
      `Attempted to parse song "${songText}" but could not find a song ID`,
      meta
    )

    return {
      kind: Validity.Invalid,
      isInvalidInput: true
    }
  }

  const song = await getSongWithAudioFeatures(spotifySongId, meta)
  if (!song) {
    logger.debug(`Could not find song "${songText}"`, meta)

    return {
      kind: Validity.Invalid,
      isSongNotFound: true
    }
  }

  logger.debug(`Found song "${songText}"`, meta)
  return {
    kind: Validity.Valid,
    song: song
  }
}
