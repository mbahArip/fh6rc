import { z } from "zod";
import { genericSuccessResponseSchema } from "./common";

// --- POST /api/source/online_radio/cast -------------------------------

export const castOnlineRadioBodySchema = z.object({
  url: z.url({ message: "URL must be a valid stream URL" }),
  name: z.string({ message: "Station name must be a string" }).optional(),
  logo: z.string({ message: "Logo URL must be a string" }).optional(),
});
export type CastOnlineRadioBody = z.infer<typeof castOnlineRadioBodySchema>;

export const castOnlineRadioResponseSchema = genericSuccessResponseSchema;
export type CastOnlineRadioResponse = z.infer<
  typeof castOnlineRadioResponseSchema
>;

