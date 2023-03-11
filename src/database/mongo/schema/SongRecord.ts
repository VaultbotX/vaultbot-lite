import { mongoConnection } from "../../index"

// @ts-ignore
const songRecordSchema: mongoConnection.Schema = new mongoConnection.Schema({
  userId: { type: String, required: true, index: true },
  userTag: { type: String, required: true },
  songId: { type: String, required: true },
  guildId: { type: String, required: true, index: true },
  guildName: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
})

export const SongRecord = mongoConnection.model("SongRecord", songRecordSchema)
