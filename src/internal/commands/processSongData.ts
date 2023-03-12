import { Song } from "../types/Song"
import { Snowflake } from "discord.js"
import { ProcessSongDataResult } from "../types/ProcessSongDataResult"

export async function processSongData(
  song: Song,
  meta: { interactionId: Snowflake }
): Promise<ProcessSongDataResult> {
  /**
   * Things that need to happen in here specifically:
   *
   * 1. Check if the song is currently in the playlist. For this, it might be best to query the playlist
   * on initialization and store it in memory, then check if the song is in the playlist on every
   * interaction. This would be the most efficient way to do it for the time being.
   * Alternatively, we could just store this in a new MongoDB collection, which may provide
   * better control over how we query the data. This should probably be cleared and re-populated
   * on initialization, and then updated on every interaction.
   *
   * 2. If the song is not in the playlist, add it to the playlist.
   * This should not just add the song, but also consider the additional data that is associated with it.
   * For example, we may need to add a new album record, and 1+ new artist records, and 1+ new genre records.
   * If the album and artist(s) already exist, we should check if the album art and artist art are the same.
   * If they are not, we should update the album art and artist art to the new ones.
   *
   * The above database updates are related to the Neo4j database. For user-specific data, we will
   * add these to the MongoDB database. We should check if the song already exists, and add it if it does not.
   * Then, we need to add a new SongRecord to the database, representing an instance that a user has added
   * the song to the playlist.
   *
   * 2.5 If any of the above steps fail, we should undo the changes that were made, which may be an interesting
   * challenge to figure out how to do since we are dealing with multiple databases.
   *
   * 3. We return success back to the user, and we also return the song that was added to the playlist.
   */

  return {}
}
