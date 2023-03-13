import { Song } from "./Song"
import { Validity } from "./Validity"

export type GetSongResult = 
{ kind: Validity.Valid, song: Song } 
| InvalidSongResult

export type InvalidSongResult = {
  kind: Validity.Invalid
  isInvalidInput?: boolean
  isSongNotFound?: boolean
}