import { Song } from "./Song";

export type GetSongResult = {
  song?: Song;
  isInvalidInput?: boolean;
  isSongNotFound?: boolean;
}