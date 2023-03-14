import { Client } from "spotify-api.js"
import { logger } from "../logger"
import { redisClient } from "../database"

export let spotifyClient: Client

function onRefresh() {
  return () => {
    logger.info("Spotify token refreshed")
  }
}

export async function initSpotifyClient() {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const playlistId = process.env.SPOTIFY_PLAYLIST_ID

  if (!clientId || !clientSecret || !playlistId) {
    logger.error(
      "Spotify credentials are not set, this should have been handled during startup"
    )
    process.exit(1)
  }

  spotifyClient = await Client.create({
    token: { clientID: clientId, clientSecret: clientSecret },
    refreshToken: true,
    retryOnRateLimit: true,
    onRefresh: onRefresh(),
    cacheSettings: {
      tracks: true,
      artists: true,
      albums: true,
    },
  })

  await spotifyClient.playlists.getTracks(playlistId).then(async (songs) => {
    logger.debug(`Caching ${songs.length} songs`)
    await redisClient.connect()
    for (const playlistSong of songs) {
      const songId = playlistSong.track?.id
      const addedAt = playlistSong.addedAt
      if (!songId || !addedAt) continue
      const addedAtUnix = Date.parse(addedAt)

      await redisClient.set(songId, addedAtUnix)
    }
    await redisClient.disconnect()
    logger.debug("Finished caching all songs")
  })

  logger.info("Spotify client initialized")
}
