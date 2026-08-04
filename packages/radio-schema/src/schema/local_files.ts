import { z } from "zod";
import { genericSuccessResponseSchema, localStationSchema } from "./common";

export const localFileQueueTrackSchema = z.object({
  index: z
    .int32({ message: "Track index must be an integer" })
    .nonnegative({ message: "Track index must be non-negative" }),
  title: z.string({ message: "Track title must be a string" }),
  folder: z.string({ message: "Folder path must be a string" }),
});
export type LocalFileQueueTrack = z.infer<typeof localFileQueueTrackSchema>;

// --- GET /api/source/local_files/queue ---------------------------------

export const getLocalFilesQueueResponseSchema = z.object({
  cursor: z
    .int32({ message: "Queue cursor must be an integer" })
    .nonnegative({ message: "Queue cursor must be non-negative" }),
  tracks: z.array(localFileQueueTrackSchema, {
    message: "Queue tracks must be an array of track objects",
  }),
});
export type GetLocalFilesQueueResponse = z.infer<
  typeof getLocalFilesQueueResponseSchema
>;

// --- GET /api/source/local_files/stations ------------------------------

export const getLocalFilesStationsResponseSchema = z.object({
  stations: z.array(localStationSchema, {
    message: "Stations must be an array of local station objects",
  }),
  active_station: z.string({ message: "Active station name must be a string" }),
  track_count: z
    .int32({ message: "Track count must be an integer" })
    .nonnegative({ message: "Track count must be non-negative" }),
});
export type GetLocalFilesStationsResponse = z.infer<
  typeof getLocalFilesStationsResponseSchema
>;

// --- PUT /api/source/local_files/stations ------------------------------

export const updateLocalFilesStationsBodySchema = z.object({
  stations: z
    .array(localStationSchema, {
      message: "Stations must be an array of local station objects",
    })
    .optional(),
  active_station: z
    .string({ message: "Active station name must be a string" })
    .optional(),
});
export type UpdateLocalFilesStationsBody = z.infer<
  typeof updateLocalFilesStationsBodySchema
>;

export const updateLocalFilesStationsResponseSchema = z.object({
  track_count: z
    .int32({ message: "Track count must be an integer" })
    .nonnegative({ message: "Track count must be non-negative" }),
});
export type UpdateLocalFilesStationsResponse = z.infer<
  typeof updateLocalFilesStationsResponseSchema
>;

// --- POST /api/source/local_files/activate ----------------------------

export const activateLocalFilesStationBodySchema = z.object({
  name: z.string({ message: "Station name must be a string" }).optional(),
});
export type ActivateLocalFilesStationBody = z.infer<
  typeof activateLocalFilesStationBodySchema
>;

export const activateLocalFilesStationResponseSchema = z.object({
  track_count: z
    .int32({ message: "Track count must be an integer" })
    .nonnegative({ message: "Track count must be non-negative" }),
});
export type ActivateLocalFilesStationResponse = z.infer<
  typeof activateLocalFilesStationResponseSchema
>;

// --- POST /api/source/local_files/play ---------------------------------

export const playLocalFileIndexBodySchema = z.object({
  index: z
    .int32({ message: "Track index must be an integer" })
    .nonnegative({ message: "Track index must be non-negative" }),
});
export type PlayLocalFileIndexBody = z.infer<
  typeof playLocalFileIndexBodySchema
>;

export const playLocalFileIndexResponseSchema = genericSuccessResponseSchema;
export type PlayLocalFileIndexResponse = z.infer<
  typeof playLocalFileIndexResponseSchema
>;

// --- POST /api/source/local_files/reshuffle ----------------------------

export const reshuffleLocalFilesResponseSchema = genericSuccessResponseSchema;
export type ReshuffleLocalFilesResponse = z.infer<
  typeof reshuffleLocalFilesResponseSchema
>;

// --- POST /api/source/local_files/rescan -------------------------------

export const rescanLocalFilesResponseSchema = z.object({
  track_count: z
    .int32({ message: "Track count must be an integer" })
    .nonnegative({ message: "Track count must be non-negative" }),
});
export type RescanLocalFilesResponse = z.infer<
  typeof rescanLocalFilesResponseSchema
>;
