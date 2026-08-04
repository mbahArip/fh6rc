import { z } from "zod";
import {
  genericSuccessResponseSchema,
  sourceInfoSchema,
  trackInfoSchema,
} from "./common";
import { controlSourceActionEnum, type DSPMode, dspModeEnum } from "./enum";

export { type DSPMode, dspModeEnum };

export const gameStateSchema = z.object({
  attached: z.boolean({ message: "Game attached status must be a boolean" }),
  injector_ready: z.boolean({
    message: "Injector ready status must be a boolean",
  }),
});
export type GameState = z.infer<typeof gameStateSchema>;

export const audioStateSchema = z.object({
  active: z.boolean({ message: "Audio active status must be a boolean" }),
  native_dsp_mode: dspModeEnum,
  output_gain: z.number({ message: "Output gain must be a number" }),
  underruns: z
    .int64({ message: "Underruns count must be an integer" })
    .nonnegative({ message: "Underruns count must be non-negative" }),
  calls: z
    .int64({ message: "Calls count must be an integer" })
    .nonnegative({ message: "Calls count must be non-negative" }),
  buffer_len: z
    .int32({ message: "Buffer length must be an integer" })
    .nonnegative({ message: "Buffer length must be non-negative" }),
  out_channels: z.int32({ message: "Output channels count must be an integer" }),
  ring_avail: z
    .int32({ message: "Ring buffer available size must be an integer" })
    .nonnegative({ message: "Ring buffer available size must be non-negative" }),
  ring_capacity: z
    .int32({ message: "Ring buffer capacity must be an integer" })
    .nonnegative({ message: "Ring buffer capacity must be non-negative" }),
});
export type AudioState = z.infer<typeof audioStateSchema>;

export const sourcesStateSchema = z.object({
  active: z.string({ message: "Active source name must be a string" }),
  available: z.array(sourceInfoSchema, {
    message: "Available sources must be an array of source info objects",
  }),
});
export type SourcesState = z.infer<typeof sourcesStateSchema>;

// --- GET /api/state ----------------------------------------------------

export const getSystemStateResponseSchema = z.object({
  game: gameStateSchema,
  audio: audioStateSchema,
  sources: sourcesStateSchema,
  track: trackInfoSchema.or(z.object({})),
  errors: z.array(z.unknown(), {
    message: "Errors list must be an array",
  }),
});
export type GetSystemStateResponse = z.infer<
  typeof getSystemStateResponseSchema
>;

// --- GET /api/events ---------------------------------------------------

export const getSystemEventsResponseSchema = z.string({
  message: "Events payload must be a string",
});
export type GetSystemEventsResponse = z.infer<
  typeof getSystemEventsResponseSchema
>;

// --- GET /api/sources --------------------------------------------------

export const getSourcesResponseSchema = sourcesStateSchema;
export type GetSourcesResponse = z.infer<typeof getSourcesResponseSchema>;

// --- POST /api/source/switch -------------------------------------------

export const switchSourceBodySchema = z.object({
  source: z.string({ message: "Source identifier must be a string" }),
});
export type SwitchSourceBody = z.infer<typeof switchSourceBodySchema>;

export const switchSourceResponseSchema = genericSuccessResponseSchema;
export type SwitchSourceResponse = z.infer<typeof switchSourceResponseSchema>;

// --- GET /api/artwork --------------------------------------------------

export const getArtworkQuerySchema = z.object({
  v: z.string({ message: "Version string must be a string" }).optional(),
});
export type GetArtworkQuery = z.infer<typeof getArtworkQuerySchema>;

// --- POST /api/options -------------------------------------------------

export const setOptionsBodySchema = z.object({
  output_gain: z
    .number({ message: "Output gain must be a number" })
    .min(0.0, { message: "Output gain must be at least 0.0" })
    .max(1.0, { message: "Output gain cannot exceed 1.0" })
    .optional(),
});
export type SetOptionsBody = z.infer<typeof setOptionsBodySchema>;

export const setOptionsResponseSchema = genericSuccessResponseSchema;
export type SetOptionsResponse = z.infer<typeof setOptionsResponseSchema>;

// --- POST /api/fs/browse -----------------------------------------------

export const browseFilesystemBodySchema = z.object({
  path: z.string({ message: "Browse directory path must be a string" }).optional(),
});
export type BrowseFilesystemBody = z.infer<typeof browseFilesystemBodySchema>;

export const fsEntrySchema = z.object({
  name: z.string({ message: "Filesystem entry name must be a string" }),
  path: z.string({ message: "Filesystem entry path must be a string" }),
  has_children: z.boolean({ message: "Has children flag must be a boolean" }),
});
export type FsEntry = z.infer<typeof fsEntrySchema>;

export const browseFilesystemResponseSchema = z.object({
  parent: z.string({ message: "Parent path must be a string" }),
  path: z.string({ message: "Current path must be a string" }),
  entries: z.array(fsEntrySchema, {
    message: "Entries must be an array of filesystem entry objects",
  }),
});
export type BrowseFilesystemResponse = z.infer<
  typeof browseFilesystemResponseSchema
>;

// --- POST /api/source/{name}/{action} -----------------------------------

export const controlSourceParamsSchema = z.object({
  name: z.string({ message: "Source name must be a string" }),
  action: controlSourceActionEnum,
});
export type ControlSourceParams = z.infer<typeof controlSourceParamsSchema>;

export const controlSourceResponseSchema = genericSuccessResponseSchema;
export type ControlSourceResponse = z.infer<typeof controlSourceResponseSchema>;
