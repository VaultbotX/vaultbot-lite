import { Song } from "../../internal/types/Song"
import { spotifyClient } from "../index"
import { logger } from "../../logger"
import { Image } from "spotify-types"
import { SpotifyAPIError } from "spotify-api.js";

function getLargestImage(a: Image, b: Image) {
  if (!a.width && !b.width) return 0
  if (!a.width) return 1
  if (!b.width) return -1
  return b.width - a.width
}

export async function getSongWithAudioFeatures(
  trackId: string
): Promise<Song | null> {
  const spotifySong = await spotifyClient.tracks.get(trackId)
    .catch((error: SpotifyAPIError) => {
      if (error.response?.status === 400) {
        const meta = { statusText: error.response?.statusText }
        logger.debug(`Track with id "${trackId}" not found`, meta)
        return null
      }

      const meta = { error }
      logger.error(`Error getting track with id "${trackId}"`, meta)
    })
  if (!spotifySong) return null

  const spotifyAudioFeatures = await spotifyClient.tracks.getAudioFeatures(
    trackId
  )
  if (!spotifyAudioFeatures) {
    logger.error(
      `Track with id ${trackId} (${spotifySong.name}) has no audio features`
    )
    return null
  }

  const song: Song = {
    id: spotifySong.id,
    name: spotifySong.name,
    artists: spotifySong.artists.map((artist) => ({
      id: artist.id,
    })),
    albumId: spotifySong.album ? spotifySong.album.id : undefined,
    albumName: spotifySong.album ? spotifySong.album.name : undefined,
    albumArtUrl: spotifySong.album
      ? spotifySong.album.images.sort((a, b) => getLargestImage(a, b))[0].url
      : undefined,
    duration: spotifySong.duration,
    audioFeatures: {
      acousticness: spotifyAudioFeatures.acousticness,
      danceability: spotifyAudioFeatures.danceability,
      energy: spotifyAudioFeatures.energy,
      instrumentalness: spotifyAudioFeatures.instrumentalness,
      liveness: spotifyAudioFeatures.liveness,
      speechiness: spotifyAudioFeatures.speechiness,
      tempo: spotifyAudioFeatures.tempo,
      valence: spotifyAudioFeatures.valence,
    },
  }

  return { ...song }
}
