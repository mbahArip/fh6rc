import { z } from "zod";
import {
  jellyfinStationSchema,
  localStationSchema,
  radioStationSchema,
  youTubeStationSchema,
} from "./common";
import { raceStartPlaybackTypeEnum } from "./enum";

export const generalConfigSchema = z.object({
  port: z.int32({ message: "Server port must be an integer" }),
  ring_buffer_mb: z.int32({ message: "Ring buffer size in MB must be an integer" }),
  default_source: z.string({ message: "Default source identifier must be a string" }),
  fallback_source: z.string({ message: "Fallback source identifier must be a string" }),
  ffmpeg_path: z.string({ message: "FFmpeg path must be a string" }),
});
export type GeneralConfig = z.infer<typeof generalConfigSchema>;

export const localFilesConfigSchema = z.object({
  enabled: z.boolean({ message: "Local files enabled flag must be a boolean" }),
  active_station: z.string({ message: "Active station name must be a string" }),
  stations: z.array(localStationSchema, {
    message: "Stations must be an array of local station objects",
  }),
  supported_formats: z.array(
    z.string({ message: "Supported format extension must be a string" }),
    { message: "Supported formats must be an array of format extensions" }
  ),
});
export type LocalFilesConfig = z.infer<typeof localFilesConfigSchema>;

export const youtubeMusicConfigSchema = z.object({
  enabled: z.boolean({ message: "YouTube Music enabled flag must be a boolean" }),
  cookies_path: z.string({ message: "Cookies file path must be a string" }),
  yt_dlp_path: z.string({ message: "yt-dlp executable path must be a string" }),
  active_station: z.string({ message: "Active station name must be a string" }),
  stations: z.array(youTubeStationSchema, {
    message: "Stations must be an array of YouTube station objects",
  }),
  shuffle: z.boolean({ message: "Shuffle flag must be a boolean" }),
});
export type YouTubeMusicConfig = z.infer<typeof youtubeMusicConfigSchema>;

export const jellyfinConfigSchema = z.object({
  enabled: z.boolean({ message: "Jellyfin enabled flag must be a boolean" }),
  server_url: z.string({ message: "Server URL must be a string" }),
  api_key: z.string({ message: "API key must be a string" }),
  user_id: z.string({ message: "User ID must be a string" }),
  active_station: z.string({ message: "Active station name must be a string" }),
  stations: z.array(jellyfinStationSchema, {
    message: "Stations must be an array of Jellyfin station objects",
  }),
  shuffle: z.boolean({ message: "Shuffle flag must be a boolean" }),
});
export type JellyfinConfig = z.infer<typeof jellyfinConfigSchema>;

export const externalAudioConfigSchema = z.object({
  enabled: z.boolean({ message: "External audio enabled flag must be a boolean" }),
  endpoint_id: z.string({ message: "Endpoint ID must be a string" }),
  media_session_id: z.string({ message: "Media session ID must be a string" }),
});
export type ExternalAudioConfig = z.infer<typeof externalAudioConfigSchema>;

export const spotifyConfigSchema = z.object({
  enabled: z.boolean({ message: "Spotify enabled flag must be a boolean" }),
  librespot_path: z.string({ message: "librespot path must be a string" }),
  cache_dir: z.string({ message: "Cache directory path must be a string" }),
});
export type SpotifyConfig = z.infer<typeof spotifyConfigSchema>;

export const onlineRadioConfigSchema = z.object({
  enabled: z.boolean({ message: "Online radio enabled flag must be a boolean" }),
  default_station_index: z
    .int32({ message: "Default station index must be an integer" })
    .nonnegative({ message: "Default station index must be non-negative" }),
  stations: z.array(radioStationSchema, {
    message: "Stations must be an array of radio station objects",
  }),
});
export type OnlineRadioConfig = z.infer<typeof onlineRadioConfigSchema>;

export const vanillaRadioConfigSchema = z.object({
  enabled: z.boolean({ message: "Vanilla radio enabled flag must be a boolean" }),
});
export type VanillaRadioConfig = z.infer<typeof vanillaRadioConfigSchema>;

export const audioConfigSchema = z.object({
  output_gain: z.number({ message: "Output gain must be a number" }),
});
export type AudioConfig = z.infer<typeof audioConfigSchema>;

export const playbackConfigSchema = z.object({
  race_start_playback: raceStartPlaybackTypeEnum,
  volume_normalization: z.boolean({
    message: "Volume normalization flag must be a boolean",
  }),
  equalizer_enabled: z.boolean({
    message: "Equalizer enabled flag must be a boolean",
  }),
  equalizer_bands: z.array(z.number({ message: "Equalizer band gain must be a number" }), {
    message: "Equalizer bands must be an array of numbers",
  }),
  force_stereo_audio: z.boolean({
    message: "Force stereo audio flag must be a boolean",
  }),
  prebuffer_next_track: z.boolean({
    message: "Prebuffer next track flag must be a boolean",
  }),
});
export type PlaybackConfig = z.infer<typeof playbackConfigSchema>;

export const hotkeysConfigSchema = z.object({
  kb_skip: z.int32({ message: "Keyboard skip hotkey code must be an integer" }),
  pad_skip: z.int32({ message: "Gamepad skip hotkey code must be an integer" }),
  kb_source: z.int32({ message: "Keyboard source hotkey code must be an integer" }),
  pad_source: z.int32({ message: "Gamepad source hotkey code must be an integer" }),
  kb_playpause: z.int32({ message: "Keyboard play/pause hotkey code must be an integer" }),
  pad_playpause: z.int32({ message: "Gamepad play/pause hotkey code must be an integer" }),
  kb_prev: z.int32({ message: "Keyboard previous hotkey code must be an integer" }),
  pad_prev: z.int32({ message: "Gamepad previous hotkey code must be an integer" }),
  kb_next_station: z.int32({ message: "Keyboard next station hotkey code must be an integer" }),
  pad_next_station: z.int32({ message: "Gamepad next station hotkey code must be an integer" }),
});
export type HotkeysConfig = z.infer<typeof hotkeysConfigSchema>;

export const fullConfigSchema = z.object({
  general: generalConfigSchema,
  local_files: localFilesConfigSchema,
  youtube_music: youtubeMusicConfigSchema,
  jellyfin: jellyfinConfigSchema,
  external_audio: externalAudioConfigSchema,
  spotify: spotifyConfigSchema,
  online_radio: onlineRadioConfigSchema,
  vanilla_radio: vanillaRadioConfigSchema,
  audio: audioConfigSchema,
  playback: playbackConfigSchema,
  hotkeys: hotkeysConfigSchema,
});
export type FullConfig = z.infer<typeof fullConfigSchema>;

// Partial patch schema for PUT /api/config
export const patchConfigBodySchema = z.object({
  general: generalConfigSchema.partial().optional(),
  local_files: localFilesConfigSchema.partial().optional(),
  youtube_music: youtubeMusicConfigSchema.partial().optional(),
  jellyfin: jellyfinConfigSchema.partial().optional(),
  external_audio: externalAudioConfigSchema.partial().optional(),
  spotify: spotifyConfigSchema.partial().optional(),
  online_radio: onlineRadioConfigSchema.partial().optional(),
  vanilla_radio: vanillaRadioConfigSchema.partial().optional(),
  audio: audioConfigSchema.partial().optional(),
  playback: playbackConfigSchema.partial().optional(),
  hotkeys: hotkeysConfigSchema.partial().optional(),
});
export type PatchConfigBody = z.infer<typeof patchConfigBodySchema>;

// --- GET /api/config ----------------------------------------------------

export const getConfigResponseSchema = fullConfigSchema;
export type GetConfigResponse = z.infer<typeof getConfigResponseSchema>;

// --- PUT /api/config ----------------------------------------------------

export const updateConfigBodySchema = patchConfigBodySchema;
export type UpdateConfigBody = z.infer<typeof updateConfigBodySchema>;

export const updateConfigResponseSchema = fullConfigSchema;
export type UpdateConfigResponse = z.infer<typeof updateConfigResponseSchema>;

// --- POST /api/config/reload --------------------------------------------

export const reloadConfigResponseSchema = fullConfigSchema;
export type ReloadConfigResponse = z.infer<typeof reloadConfigResponseSchema>;

