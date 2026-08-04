import { z } from "zod";
import { genericSuccessResponseSchema, jellyfinStationSchema } from "./common";

export const jellyfinQueueTrackSchema = z.object({
  index: z
    .int32({ message: "Track index must be an integer" })
    .nonnegative({ message: "Track index must be non-negative" }),
  title: z.string({ message: "Track title must be a string" }),
  artist: z.string({ message: "Artist name must be a string" }),
  album: z.string({ message: "Album name must be a string" }),
});
export type JellyfinQueueTrack = z.infer<typeof jellyfinQueueTrackSchema>;

// --- POST /api/source/jellyfin/cast ------------------------------------

export const castJellyfinBodySchema = z.object({
  playlist_id: z.string({ message: "Playlist ID must be a string" }).optional(),
  use_favorites: z
    .boolean({ message: "Use favorites flag must be a boolean" })
    .optional(),
});
export type CastJellyfinBody = z.infer<typeof castJellyfinBodySchema>;

export const castJellyfinResponseSchema = genericSuccessResponseSchema;
export type CastJellyfinResponse = z.infer<typeof castJellyfinResponseSchema>;

// --- POST /api/source/jellyfin/shuffle ---------------------------------

export const setJellyfinShuffleBodySchema = z.object({
  shuffle: z.boolean({ message: "Shuffle flag must be a boolean" }),
});
export type SetJellyfinShuffleBody = z.infer<
  typeof setJellyfinShuffleBodySchema
>;

export const setJellyfinShuffleResponseSchema = genericSuccessResponseSchema;
export type SetJellyfinShuffleResponse = z.infer<
  typeof setJellyfinShuffleResponseSchema
>;

// --- GET /api/source/jellyfin/stations ---------------------------------

export const getJellyfinStationsResponseSchema = z.object({
  stations: z.array(jellyfinStationSchema, {
    message: "Stations must be an array of Jellyfin station objects",
  }),
  active_station: z.string({ message: "Active station name must be a string" }),
});
export type GetJellyfinStationsResponse = z.infer<
  typeof getJellyfinStationsResponseSchema
>;

// --- PUT /api/source/jellyfin/stations ---------------------------------

export const updateJellyfinStationsBodySchema = z.object({
  stations: z
    .array(jellyfinStationSchema, {
      message: "Stations must be an array of Jellyfin station objects",
    })
    .optional(),
  active_station: z
    .string({ message: "Active station name must be a string" })
    .optional(),
});
export type UpdateJellyfinStationsBody = z.infer<
  typeof updateJellyfinStationsBodySchema
>;

export const updateJellyfinStationsResponseSchema =
  genericSuccessResponseSchema;
export type UpdateJellyfinStationsResponse = z.infer<
  typeof updateJellyfinStationsResponseSchema
>;

// --- POST /api/source/jellyfin/activate --------------------------------

export const activateJellyfinStationBodySchema = z.object({
  name: z.string({ message: "Station name must be a string" }).optional(),
});
export type ActivateJellyfinStationBody = z.infer<
  typeof activateJellyfinStationBodySchema
>;

export const activateJellyfinStationResponseSchema =
  genericSuccessResponseSchema;
export type ActivateJellyfinStationResponse = z.infer<
  typeof activateJellyfinStationResponseSchema
>;

// --- GET /api/source/jellyfin/queue -----------------------------------

export const getJellyfinQueueResponseSchema = z.object({
  cursor: z
    .int32({ message: "Queue cursor must be an integer" })
    .nonnegative({ message: "Queue cursor must be non-negative" }),
  tracks: z.array(jellyfinQueueTrackSchema, {
    message: "Queue tracks must be an array of track objects",
  }),
});
export type GetJellyfinQueueResponse = z.infer<
  typeof getJellyfinQueueResponseSchema
>;

// --- POST /api/source/jellyfin/play -----------------------------------

export const playJellyfinIndexBodySchema = z.object({
  index: z
    .int32({ message: "Track index must be an integer" })
    .nonnegative({ message: "Track index must be non-negative" }),
});
export type PlayJellyfinIndexBody = z.infer<typeof playJellyfinIndexBodySchema>;

export const playJellyfinIndexResponseSchema = genericSuccessResponseSchema;
export type PlayJellyfinIndexResponse = z.infer<
  typeof playJellyfinIndexResponseSchema
>;
