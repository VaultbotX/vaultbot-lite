import { Client } from "spotify-api.js"
import { logger } from "../logger"

export let spotifyClient: Client

function onRefresh() {
  return () => {
    logger.info("Spotify token refreshed")
  }
}

export async function initSpotifyClient() {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
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

  logger.info("Spotify client initialized")
}
