import z from "zod";

export const RaceStartPlaybackTypeEnum = z.enum(
  ["next", "restart", "ignore", "off"],
  { message: "Invalid race start playback type. Expected 'next', 'restart', 'ignore', or 'off'" }
);
export const raceStartPlaybackTypeEnum = RaceStartPlaybackTypeEnum;
export type RaceStartPlaybackType = z.infer<typeof RaceStartPlaybackTypeEnum>;

export const NativeDSPModeEnum = z.enum(
  ["off", "passthrough", "silence", "pcm", "unknown"],
  { message: "Invalid DSP mode. Expected 'off', 'passthrough', 'silence', 'pcm', or 'unknown'" }
);
export const nativeDSPModeEnum = NativeDSPModeEnum;
export const dspModeEnum = NativeDSPModeEnum;
export type NativeDSPMode = z.infer<typeof NativeDSPModeEnum>;
export type DSPMode = NativeDSPMode;

export const SourceTypeEnum = z.enum(
  [
    "local_files",
    "youtube_music",
    "jellyfin",
    "external_audio",
    "spotify",
    "online_radio",
    "vanilla_radio",
  ],
  { message: "Invalid source type. Expected a valid audio source identifier" }
);
export const sourceTypeEnum = SourceTypeEnum;
export type SourceType = z.infer<typeof SourceTypeEnum>;

export const PlaybackStateEnum = z.enum(
  ["stopped", "playing", "paused", "buffering", "unknown"],
  { message: "Invalid playback state. Expected 'stopped', 'playing', 'paused', 'buffering', or 'unknown'" }
);
export const playbackStateEnum = PlaybackStateEnum;
export type PlaybackState = z.infer<typeof PlaybackStateEnum>;

export const AuthStateEnum = z.enum(
  ["none_required", "authenticated", "needs_auth", "error", "unknown"],
  { message: "Invalid authentication state" }
);
export const authStateEnum = AuthStateEnum;
export type AuthState = z.infer<typeof AuthStateEnum>;

export const LocalFileOrderEnum = z.enum(["shuffle", "name", "folder"], {
  message: "Invalid file order. Expected 'shuffle', 'name', or 'folder'",
});
export const localFileOrderEnum = LocalFileOrderEnum;
export type LocalFileOrder = z.infer<typeof LocalFileOrderEnum>;

export const LocalFileGroupingEnum = z.enum(["folder", "tags"], {
  message: "Invalid file grouping. Expected 'folder' or 'tags'",
});
export const localFileGroupingEnum = LocalFileGroupingEnum;
export type LocalFileGrouping = z.infer<typeof LocalFileGroupingEnum>;

export const LocalFileRepeatEnum = z.enum(["all", "one", "off"], {
  message: "Invalid repeat mode. Expected 'all', 'one', or 'off'",
});
export const localFileRepeatEnum = LocalFileRepeatEnum;
export type LocalFileRepeat = z.infer<typeof LocalFileRepeatEnum>;

export const ControlSourceActionEnum = z.enum(
  ["play", "pause", "stop", "next", "previous"],
  { message: "Invalid source action. Expected 'play', 'pause', 'stop', 'next', or 'previous'" }
);
export const controlSourceActionEnum = ControlSourceActionEnum;
export type ControlSourceAction = z.infer<typeof ControlSourceActionEnum>;

