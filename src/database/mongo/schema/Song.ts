import { mongoClient } from "../../index"

// @ts-ignore
const songSchema: mongoClient.Schema = new mongoClient.Schema({
  id: { type: String, required: true, index: true },
  name: { type: String, required: true },
  artists: new mongoClient.Schema([
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      artistArtUrl: { type: String },
    },
  ]),
  albumId: { type: String },
  albumName: { type: String },
  albumArtUrl: { type: String },
  audioFeatures: {
    duration: { type: Number, required: true },
    acousticness: { type: Number, required: true },
    danceability: { type: Number, required: true },
    energy: { type: Number, required: true },
    instrumentalness: { type: Number, required: true },
    liveness: { type: Number, required: true },
    speechiness: { type: Number, required: true },
    tempo: { type: Number, required: true },
    valence: { type: Number, required: true },
  },
})

export const Song = mongoClient.model("Song", songSchema)
