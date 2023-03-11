import { SongAudioFeatures } from "./SongAudioFeatures"

export type Song = {
  id: string
  name: string
  artists: {
    id: string
    name: string
    artistArtUrl: string | undefined
  }[]
  albumId: string | undefined
  albumName: string | undefined
  albumArtUrl: string | undefined
  duration: number
  audioFeatures: SongAudioFeatures
}
