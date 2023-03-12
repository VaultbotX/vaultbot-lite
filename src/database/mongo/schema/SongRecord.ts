import { mongoClient } from "../../index"

// @ts-ignore
const songRecordSchema: mongoClient.Schema = new mongoClient.Schema({
  userId: { type: String, required: true, index: true },
  userTag: { type: String, required: true },
  songId: { type: String, required: true },
  guildId: { type: String, required: true, index: true },
  guildName: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
})

export const SongRecord = mongoClient.model("SongRecord", songRecordSchema)
