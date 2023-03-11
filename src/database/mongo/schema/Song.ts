import { mongoConnection } from "../../index";

// @ts-ignore
const songSchema: mongoConnection.Schema = new mongoConnection.Schema({
  id: { type: String, required: true, index: true },
  name: { type: String, required: true },
  artists: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    artistArtUrl: { type: String, required: true },
  }],
  albumId: { type: String, required: true },
  albumName: { type: String, required: true },
  albumArtUrl: { type: String, required: true },
  duration: { type: Number, required: true },
  acousticness: { type: Number, required: true },
  danceability: { type: Number, required: true },
  energy: { type: Number, required: true },
  instrumentalness: { type: Number, required: true },
  liveness: { type: Number, required: true},
  speechiness: { type: Number, required: true },
  tempo: { type: Number, required: true },
  valence: { type: Number, required: true },
});

export const Song = mongoConnection.model('Song', songSchema)