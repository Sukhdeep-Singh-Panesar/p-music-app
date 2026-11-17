import type { PlayerTrack } from "../components/PlayerProvider";

export type Playlist = {
  id: string;
  name: string;
  tracks: PlayerTrack[];
};
