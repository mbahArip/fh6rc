import { z } from "zod";
import { genericSuccessResponseSchema } from "./common";

export const depToolInfoSchema = z.object({
  name: z.string({ message: "Tool name must be a string" }),
  present: z.boolean({ message: "Tool presence flag must be a boolean" }),
  downloading: z.boolean({ message: "Downloading flag must be a boolean" }),
  downloaded_bytes: z
    .int64({ message: "Downloaded bytes must be an integer" })
    .nonnegative({ message: "Downloaded bytes must be non-negative" }),
  total_bytes: z
    .int64({ message: "Total bytes must be an integer" })
    .nonnegative({ message: "Total bytes must be non-negative" }),
  error: z.string({ message: "Error message must be a string" }),
});
export type DepToolInfo = z.infer<typeof depToolInfoSchema>;

// --- GET /api/deps ------------------------------------------------------

export const getDependenciesResponseSchema = z.object({
  tools: z.array(depToolInfoSchema, {
    message: "Tools must be an array of dependency tool info objects",
  }),
});
export type GetDependenciesResponse = z.infer<
  typeof getDependenciesResponseSchema
>;

// --- POST /api/deps/refresh ---------------------------------------------

export const refreshDependenciesResponseSchema = genericSuccessResponseSchema;
export type RefreshDependenciesResponse = z.infer<
  typeof refreshDependenciesResponseSchema
>;

