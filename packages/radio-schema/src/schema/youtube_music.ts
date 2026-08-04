import { z } from "zod";
import { genericSuccessResponseSchema, youTubeStationSchema } from "./common";

export const youTubeQueueTrackSchema = z.object({
  index: z
    .int32({ message: "Track index must be an integer" })
    .nonnegative({ message: "Track index must be non-negative" }),
  title: z.string({ message: "Track title must be a string" }),
  artist: z.string({ message: "Artist name must be a string" }),
  url: z.string({ message: "Video/Track URL must be a string" }),
});
export type YouTubeQueueTrack = z.infer<typeof youTubeQueueTrackSchema>;

// --- POST /api/source/youtube_music/cast -------------------------------

export const castYouTubeMusicBodySchema = z.object({
  url: z.url({ message: "URL must be a valid YouTube Music URL" }),
});
export type CastYouTubeMusicBody = z.infer<typeof castYouTubeMusicBodySchema>;

export const castYouTubeMusicResponseSchema = genericSuccessResponseSchema;
export type CastYouTubeMusicResponse = z.infer<
  typeof castYouTubeMusicResponseSchema
>;

// --- POST /api/source/youtube_music/shuffle ----------------------------

export const setYouTubeMusicShuffleBodySchema = z.object({
  shuffle: z.boolean({ message: "Shuffle flag must be a boolean" }),
});
export type SetYouTubeMusicShuffleBody = z.infer<
  typeof setYouTubeMusicShuffleBodySchema
>;

export const setYouTubeMusicShuffleResponseSchema =
  genericSuccessResponseSchema;
export type SetYouTubeMusicShuffleResponse = z.infer<
  typeof setYouTubeMusicShuffleResponseSchema
>;

// --- GET /api/source/youtube_music/stations ---------------------------

export const getYouTubeMusicStationsResponseSchema = z.object({
  stations: z.array(youTubeStationSchema, {
    message: "Stations must be an array of YouTube station objects",
  }),
  active_station: z.string({ message: "Active station name must be a string" }),
});
export type GetYouTubeMusicStationsResponse = z.infer<
  typeof getYouTubeMusicStationsResponseSchema
>;

// --- PUT /api/source/youtube_music/stations ---------------------------

export const updateYouTubeMusicStationsBodySchema = z.object({
  stations: z
    .array(youTubeStationSchema, {
      message: "Stations must be an array of YouTube station objects",
    })
    .optional(),
  active_station: z
    .string({ message: "Active station name must be a string" })
    .optional(),
});
export type UpdateYouTubeMusicStationsBody = z.infer<
  typeof updateYouTubeMusicStationsBodySchema
>;

export const updateYouTubeMusicStationsResponseSchema =
  genericSuccessResponseSchema;
export type UpdateYouTubeMusicStationsResponse = z.infer<
  typeof updateYouTubeMusicStationsResponseSchema
>;

// --- POST /api/source/youtube_music/activate --------------------------

export const activateYouTubeMusicStationBodySchema = z.object({
  name: z.string({ message: "Station name must be a string" }).optional(),
});
export type ActivateYouTubeMusicStationBody = z.infer<
  typeof activateYouTubeMusicStationBodySchema
>;

export const activateYouTubeMusicStationResponseSchema =
  genericSuccessResponseSchema;
export type ActivateYouTubeMusicStationResponse = z.infer<
  typeof activateYouTubeMusicStationResponseSchema
>;

// --- GET /api/source/youtube_music/queue -----------------------------

export const getYouTubeMusicQueueResponseSchema = z.object({
  cursor: z
    .int32({ message: "Queue cursor must be an integer" })
    .nonnegative({ message: "Queue cursor must be non-negative" }),
  tracks: z.array(youTubeQueueTrackSchema, {
    message: "Queue tracks must be an array of track objects",
  }),
});
export type GetYouTubeMusicQueueResponse = z.infer<
  typeof getYouTubeMusicQueueResponseSchema
>;

// --- POST /api/source/youtube_music/play ------------------------------

export const playYouTubeMusicIndexBodySchema = z.object({
  index: z
    .int32({ message: "Track index must be an integer" })
    .nonnegative({ message: "Track index must be non-negative" }),
});
export type PlayYouTubeMusicIndexBody = z.infer<
  typeof playYouTubeMusicIndexBodySchema
>;

export const playYouTubeMusicIndexResponseSchema = genericSuccessResponseSchema;
export type PlayYouTubeMusicIndexResponse = z.infer<
  typeof playYouTubeMusicIndexResponseSchema
>;
