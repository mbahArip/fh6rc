// One file per group, saved to ./docs/schema/<group>.ts (this file represents one such group).
// Generated on <date: YYYY-MM-DD> (v<version>) from ./deps/fh6-universal-radio/src/http/http_server.cpp — reflects the C++ implementation as of this read;
// regenerate if the source changes.
// Metadata and structs shared across groups belong in ./docs/schema/common.ts and are imported here.
import { z } from "zod";
import { API_VERSION, GENERATED_AT } from "./common";

// --- Shared / nested object schemas -----------------------------------
// Define reusable structs once, reference them from every endpoint that uses them.

export const exampleSchema = z.object({
  id: z.int32(),
  name: z.string(),
  oldName: z.string().optional().meta({ deprecated: true, description: "Deprecated in v1.2.0, replaced with name" }),
  note: z.string().optional(), // only optional if the C++ source demonstrably treats it that way
});
export type Example = z.infer<typeof exampleSchema>;

// --- GET /example/{id} --------------------------------------------------

export const getExampleByIdParamsSchema = z.object({
  id: z.coerce.number().int(),
});
export type GetExampleByIdParams = z.infer<typeof getExampleByIdParamsSchema>;

export const getExampleByIdQuerySchema = z.object({
  verbose: z.coerce.boolean().optional(),
});
export type GetExampleByIdQuery = z.infer<typeof getExampleByIdQuerySchema>;

export const getExampleByIdResponseSchema = exampleSchema;
export type GetExampleByIdResponse = z.infer<typeof getExampleByIdResponseSchema>;

// --- POST /example --------------------------------------------------

export const createExampleBodySchema = z.object({
  name: z.string(),
});
export type CreateExampleBody = z.infer<typeof createExampleBodySchema>;

export const createExampleResponseSchema = exampleSchema;
export type CreateExampleResponse = z.infer<typeof createExampleResponseSchema>;