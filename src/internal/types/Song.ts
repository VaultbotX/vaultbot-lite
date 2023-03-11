import { SongAudioFeatures } from "./SongAudioFeatures"

export type Song = {
  id: string
  name: string
  artists: {
    id: string
  }[]
  albumId: string | undefined
  albumName: string | undefined
  albumArtUrl: string | undefined
  duration: number
  audioFeatures: SongAudioFeatures
}
