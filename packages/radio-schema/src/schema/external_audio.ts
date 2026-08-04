import { z } from "zod";

export const externalAudioDeviceSchema = z.object({
  id: z.string({ message: "Device ID must be a string" }),
  name: z.string({ message: "Device name must be a string" }),
  is_default: z.boolean({ message: "Is default flag must be a boolean" }),
});
export type ExternalAudioDevice = z.infer<typeof externalAudioDeviceSchema>;

export const externalAudioMediaSessionSchema = z.object({
  id: z.string({ message: "Media session ID must be a string" }),
  name: z.string({ message: "Media session name must be a string" }),
  is_current: z.boolean({ message: "Is current flag must be a boolean" }),
  is_selected: z.boolean({ message: "Is selected flag must be a boolean" }),
});
export type ExternalAudioMediaSession = z.infer<
  typeof externalAudioMediaSessionSchema
>;

// --- GET /api/external_audio/devices -----------------------------------

export const getExternalAudioDevicesResponseSchema = z.object({
  enabled: z.boolean({ message: "Enabled flag must be a boolean" }),
  endpoint_id: z.string({ message: "Endpoint ID must be a string" }),
  media_session_id: z.string({ message: "Media session ID must be a string" }),
  media_sessions_available: z.boolean({
    message: "Media sessions available flag must be a boolean",
  }),
  media_sessions: z.array(externalAudioMediaSessionSchema, {
    message: "Media sessions must be an array",
  }),
  devices: z.array(externalAudioDeviceSchema, {
    message: "Devices must be an array",
  }),
});
export type GetExternalAudioDevicesResponse = z.infer<
  typeof getExternalAudioDevicesResponseSchema
>;

// --- PUT /api/external_audio/config ------------------------------------

export const updateExternalAudioConfigBodySchema = z.object({
  endpoint_id: z.string({ message: "Endpoint ID must be a string" }).optional(),
  media_session_id: z
    .string({ message: "Media session ID must be a string" })
    .optional(),
  enabled: z.boolean({ message: "Enabled flag must be a boolean" }).optional(),
});
export type UpdateExternalAudioConfigBody = z.infer<
  typeof updateExternalAudioConfigBodySchema
>;

export const updateExternalAudioConfigResponseSchema = z.object({
  enabled: z.boolean({ message: "Enabled flag must be a boolean" }),
  endpoint_id: z.string({ message: "Endpoint ID must be a string" }),
  media_session_id: z.string({ message: "Media session ID must be a string" }),
});
export type UpdateExternalAudioConfigResponse = z.infer<
  typeof updateExternalAudioConfigResponseSchema
>;
