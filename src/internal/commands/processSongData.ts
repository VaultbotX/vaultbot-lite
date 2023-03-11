import { Song } from "../types/Song";
import { Snowflake } from "discord.js";
import { ProcessSongDataResult } from "../types/ProcessSongDataResult";

export async function processSongData(song: Song, meta: { interactionId: Snowflake }): Promise<ProcessSongDataResult> {
  // process the song data here, such as adding it to the database
  // and related checks to ensure that the data was added correctly
  // and adding to the actual playlist of course

  return {}
}