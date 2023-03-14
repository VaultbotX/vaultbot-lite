import { Validity } from "./Validity";
import { Song } from "./Song";

export type ProcessSongDataResult = { kind: Validity.Valid, song: Song }
  | InvalidProcessSongDataResult

export type InvalidProcessSongDataResult = {
  kind: Validity.Invalid
  isAlreadyAdded?: boolean
}