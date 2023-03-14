import { Song } from "../types/Song";
import { Snowflake } from "discord.js";
import { ProcessSongDataResult } from "../types/ProcessSongDataResult";
import { redisClient } from "../../database";
import { logger } from "../../logger";
import { Validity } from "../types/Validity";

export async function processSongData(
  song: Song,
  meta: { interactionId: Snowflake }
): Promise<ProcessSongDataResult> {
  await redisClient.connect()
  const existingSong = await redisClient.get(song.id)
  if (existingSong) {
    logger.debug(
      `Song "${song.id}" is already in the playlist, skipping...`,
      meta
    )
    await redisClient.disconnect()
    return {
      kind: Validity.Invalid,
      isAlreadyAdded: true,
    }
  }
  await redisClient.disconnect()
  logger.debug(`Song ${song.id} is not in the playlist, adding...`, meta)

  /**
   * Things that need to happen in here specifically:
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

  return {
    kind: Validity.Valid,
    song: song,
  }
}
