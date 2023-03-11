import { SongAudioFeatures } from "./SongAudioFeatures"
import { Artist } from "./Artist";

export type Song = {
  id: string
  name: string
  artists: Artist[]
  albumId: string | undefined
  albumName: string | undefined
  albumArtUrl: string | undefined
  duration: number
  audioFeatures: SongAudioFeatures
}
