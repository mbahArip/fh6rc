import z from "zod";
import {
  type AuthState,
  authStateEnum,
  type PlaybackState,
  playbackStateEnum,
} from "./enum";

export { type AuthState, authStateEnum, type PlaybackState, playbackStateEnum };

export const trackInfoSchema = z.object({
  title: z.string({ message: "Track title must be a string" }),
  artist: z.string({ message: "Artist name must be a string" }),
  album: z.string({ message: "Album name must be a string" }),
  artwork_url: z.string({ message: "Artwork URL must be a string" }),
  duration_ms: z
    .int32({ message: "Duration in milliseconds must be an integer" })
    .nonnegative({ message: "Duration in milliseconds must be non-negative" }),
  position_ms: z
    .int32({ message: "Position in milliseconds must be an integer" })
    .nonnegative({ message: "Position in milliseconds must be non-negative" }),
});
export type TrackInfo = z.infer<typeof trackInfoSchema>;

export const sourceCapabilitiesSchema = z.object({
  seek: z.boolean({ message: "Seek capability must be a boolean" }),
  previous: z.boolean({
    message: "Previous track capability must be a boolean",
  }),
  queue: z.boolean({ message: "Queue capability must be a boolean" }),
});
export type SourceCapabilities = z.infer<typeof sourceCapabilitiesSchema>;

export const sourceInfoSchema = z.object({
  name: z.string({ message: "Source name must be a string" }),
  display_name: z.string({ message: "Display name must be a string" }),
  playback_state: playbackStateEnum,
  auth_state: authStateEnum,
  auth_instructions: z.string({
    message: "Auth instructions must be a string",
  }),
  capabilities: sourceCapabilitiesSchema,
  details: z.record(
    z.string({ message: "Detail key must be a string" }),
    z.unknown(),
    {
      message: "Details must be an object with string keys",
    },
  ),
});
export type SourceInfo = z.infer<typeof sourceInfoSchema>;

export const localStationSchema = z.object({
  name: z.string({ message: "Station name must be a string" }),
  roots: z.array(z.string({ message: "Root path must be a string" }), {
    message: "Roots must be an array of directory paths",
  }),
  excluded: z.array(z.string({ message: "Excluded path must be a string" }), {
    message: "Excluded paths must be an array of strings",
  }),
  recursive: z.boolean({ message: "Recursive scan flag must be a boolean" }),
  order: z.string({ message: "Track ordering mode must be a string" }),
  grouping: z.string({ message: "Track grouping mode must be a string" }),
  repeat: z.string({ message: "Repeat mode must be a string" }),
});
export type LocalStation = z.infer<typeof localStationSchema>;

export const youTubeStationSchema = z.object({
  name: z.string({ message: "Station name must be a string" }),
  url: z.string({ message: "YouTube station URL must be a string" }),
});
export type YouTubeStation = z.infer<typeof youTubeStationSchema>;

export const jellyfinStationSchema = z.object({
  name: z.string({ message: "Station name must be a string" }),
  playlist_id: z.string({ message: "Playlist ID must be a string" }),
  use_favorites: z.boolean({ message: "Use favorites flag must be a boolean" }),
});
export type JellyfinStation = z.infer<typeof jellyfinStationSchema>;

export const radioStationSchema = z.object({
  name: z.string({ message: "Station name must be a string" }),
  url: z.string({ message: "Stream URL must be a string" }),
  favicon: z.string({ message: "Favicon URL must be a string" }),
  tags: z.string({ message: "Station tags must be a string" }),
  country: z.string({ message: "Country code/name must be a string" }),
  codec: z.string({ message: "Audio codec must be a string" }),
  bitrate: z
    .int32({ message: "Bitrate must be an integer" })
    .nonnegative({ message: "Bitrate must be non-negative" }),
  uuid: z.string({ message: "Station UUID must be a string" }),
  favorite: z.boolean({ message: "Favorite flag must be a boolean" }),
});
export type RadioStation = z.infer<typeof radioStationSchema>;

export const genericSuccessResponseSchema = z.object({
  ok: z.boolean({ message: "Success flag 'ok' must be a boolean" }),
});
export type GenericSuccessResponse = z.infer<
  typeof genericSuccessResponseSchema
>;

export const genericErrorResponseSchema = z.object({
  error: z.string({ message: "Error message must be a string" }),
});
export type GenericErrorResponse = z.infer<typeof genericErrorResponseSchema>;
