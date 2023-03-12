import { Song } from "../../internal/types/Song"
import { spotifyClient } from "../index"
import { logger } from "../../logger"
import { Image } from "spotify-types"
import { SpotifyAPIError } from "spotify-api.js"
import { Snowflake } from "discord.js"
import { Artist } from "../../internal/types/Artist"

function getLargestImage(a: Image, b: Image) {
  if (!a.width && !b.width) return 0
  if (!a.width) return 1
  if (!b.width) return -1
  return b.width - a.width
}

export async function getSongWithAudioFeatures(
  trackId: string,
  defaultMeta: { interactionId: Snowflake }
): Promise<Song | null> {
  const spotifySong = await spotifyClient.tracks
    .get(trackId)
    .catch((error: SpotifyAPIError) => {
      if (error.response?.status === 400) {
        const meta = { statusText: error.response?.statusText, ...defaultMeta }
        logger.debug(`Track with id "${trackId}" not found`, meta)
        return null
      }

      const meta = { error, ...defaultMeta }
      logger.error(`Error getting track with id "${trackId}"`, meta)
    })
  if (!spotifySong) return null

  const spotifyAudioFeatures = await spotifyClient.tracks.getAudioFeatures(
    trackId
  )
  if (!spotifyAudioFeatures) {
    logger.error(
      `Track with id "${trackId}" (${spotifySong.name}) has no audio features`,
      defaultMeta
    )
    return null
  }

  const spotifyArtists = await spotifyClient.artists.getMultiple(
    spotifySong.artists.map((artist) => artist.id)
  )

  const artists: Artist[] = []
  spotifyArtists.forEach((spotifyArtist) => {
    if (!spotifyArtist) return
    artists.push({
      id: spotifyArtist.id,
      name: spotifyArtist.name,
      artistArtUrl: spotifyArtist.images
        ? spotifyArtist.images.sort((a, b) => getLargestImage(a, b))[0].url
        : undefined,
      genres: spotifyArtist.genres?.map((genre) => genre.toLowerCase()) ?? [],
    })
  })

  const song: Song = {
    id: spotifySong.id,
    name: spotifySong.name,
    artists: artists,
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
