---
name: generate-docs
description: Reads the C++ source file at ./deps/fh6-universal-radio/src/http/http_server.cpp (and its companion header) and generates an OpenAPI 3.1 specification (renderable in Swagger UI or Scalar) plus matching Zod v4 schemas for the query parameters, request body, and response body of every REST endpoint it defines. Use this whenever the user asks for API documentation, an OpenAPI/Swagger spec, or TypeScript/Zod validation schemas for this backend — they don't need to name the file, since it's always this fixed one. Also trigger when the user asks to keep API docs or Zod schemas "in sync" with the C++ backend, to "regenerate the contract", or to run a "dry run" / "preview" of doc generation.
---

# C++ API → OpenAPI + Zod v4 Contract Generator

## Prerequisites

Ensure that `./deps/fh6-universal-radio/src/http/http_server.cpp` exists.
If it is missing, ask the user if they want to pull dependencies. If confirmed, run `bun run deps:sync` and wait for execution to complete.

## Why this exists

The endpoint is defined once, in C++. Everything downstream — the API docs and the client-side validation layer — should describe *exactly* what that C++ code does, not what convention says an endpoint like this "usually" looks like. Wrong docs and mismatched Zod schemas are worse than none, because they fail silently until a real request breaks the contract. Trace every field, type, and optionality back to an actual line of C++ before writing it down. If the source is genuinely ambiguous about something, say so rather than guessing.

## Project context (fh6)

`./deps/fh6-universal-radio/src/http/http_server.cpp` is part of the **fh6** project. From its includes:

- **HTTP framework:** `fh6/http/http_server.hpp` — an in-house server, not a public framework like Crow/Drogon/etc. Use the "custom / unrecognized" section of `references/frameworks.md` to locate method/path/param/body extraction, rather than looking for a known-framework pattern.
- **JSON library:** `nlohmann/json.hpp` is included directly, so treat `nlohmann::json` as confirmed for body/response (de)serialization — no need to re-detect it per endpoint (see the nlohmann notes in `references/frameworks.md`).
- **Platform:** built against `winsock2.h`/`windows.h` — this is a Windows-only transport detail underneath the custom HTTP server and has no bearing on the API contract itself; don't reflect it in the OpenAPI spec or Zod schemas.
- **Likely route groups**, based on the modules included: `audio_source_manager` (playback/source control), `config_store` (configuration endpoints), and per-source handlers under `sources/` — `local_file_source`, `youtube_music_source`, `jellyfin_source`, `external_audio_source`, `external_media_session`, `spotify_source`, `online_radio_source`. Confirm the actual grouping against the route paths/handler organization in the file itself (see step 3) rather than assuming this list is exhaustive or that every module necessarily exposes HTTP endpoints.

## Workflow

### 1. Gather the source

Base this on the file at `./deps/fh6-universal-radio/src/http/http_server.cpp`, resolved relative to the current working directory (repo root). This is the one and only source file for this skill — don't ask the user which file to use, don't search for other candidates, and don't fall back to a similarly-named file if this exact path is missing.

**Check the file exists before doing anything else.** If `./deps/fh6-universal-radio/src/http/http_server.cpp` isn't found at that path, stop immediately: report that the file is missing, show the exact path that was checked, and don't attempt to generate any docs, schemas, or partial output. Don't guess at the intended endpoints from memory or from any other file in the repo.

If the file exists, also read its companion header (same base name, or one it `#include`s that looks like it declares request/response structs, DTOs, or route registration) — request/response shapes are frequently declared in headers, not the `.cpp` file itself.

### 2. Determine Version and Date

Before generating artifacts:

- **Generation Date**: Record the current date formatted as `YYYY-MM-DD`.
- **Version Resolution**: Ask the user whether they want to:
  1. Input the version manually, OR
  2. Attempt to fetch the version automatically from `https://www.nexusmods.com/forzahorizon6/mods/215`.

  - **If automatic fetching is selected**: Fetch `https://www.nexusmods.com/forzahorizon6/mods/215` and extract the mod version.
  - **If automatic fetching fails or version cannot be retrieved**: Inform the user: *"Failed to automatically retrieve the version from Nexus Mods. Please enter the version manually."* and prompt the user to input the version number.

### 3. Identify the framework

Already known for this project (see Project context above): the "custom / unrecognized" section of `references/frameworks.md`, with `nlohmann::json` as the serialization library. Use that section as the lookup for where the method, path, params, body, and response actually live in the code.

### 4. Extract each endpoint

For every route handler in the file, pin down:

- **HTTP method** and **path**, including path parameters (`:id`, `{id}`, regex captures)
- **Query parameters**: name, required or optional, and type
- **Request body**: fields read from the incoming JSON/body, their C++ types, and which are optional
- **Response body**: fields written into the outgoing JSON/response object, and their types
- **Status codes**: the success code and any explicit error codes the handler returns
- **Group**: which namespace/module the endpoint belongs to — usually visible from the path prefix (e.g. everything under `/sources/spotify/...`), which source/manager class the handler calls into (`SpotifySource`, `ConfigStore`, ...), or a comment/section header grouping handlers in the file. Use whatever grouping the code itself actually expresses; the module list in Project context is a hint about what to expect, not a fixed taxonomy to force endpoints into.

A field is optional only if the code demonstrably treats it that way — a default value, a `std::optional<T>` wrapper, or an explicit presence check (`.contains(...)`, `.count(...)`, `find() != end()`) before it's used. Otherwise treat it as required. Don't loosen this based on assumption either way.

### 5. Map C++ types

Use `references/type-mapping.md` to convert each C++ type to its OpenAPI/JSON Schema equivalent and its Zod v4 equivalent. Watch for:

- `std::optional<T>` → optional field in both outputs
- `std::vector<T>` / `std::array<T,N>` → array
- nested structs → a named nested object schema, defined once and referenced (`$ref` in OpenAPI, a named exported const in Zod) rather than inlined at every use site
- `enum class` → OpenAPI `enum` + Zod `z.enum([...])`

### 6. Generate the OpenAPI spec

Produce a single OpenAPI 3.1 document (YAML), starting from the skeleton in `assets/openapi.template.yml`, and save it to **`./docs/<VERSION>/openapi.yaml`** (and also `./docs/openapi.yaml`).

- Set `info.version` to the resolved version string.
- Set `info.description` to include the generation date and version, e.g.: `Generated on <YYYY-MM-DD> (v<VERSION>) from ./deps/fh6-universal-radio/src/http/http_server.cpp — reflects the C++ implementation as of this read; regenerate if the source changes.`

Tag every operation with the same group it was assigned in step 4 (`tags: [spotify]`, `tags: [config]`, ...) so the spec's grouping in Swagger UI/Scalar matches the Zod file split below.

### 7. Generate Zod v4 schemas

Always create **`./docs/<VERSION>/schema/common.ts`** at the top of the schema generation process (following `assets/common.template.ts`). It must export the version and date constants, plus any shared struct schemas:

```typescript
export const API_VERSION = "<VERSION>";
export const GENERATED_AT = "<YYYY-MM-DD>";
```

Split group-specific schemas into **`./docs/<VERSION>/schema/<group>.ts`** (e.g. `./docs/<VERSION>/schema/spotify.ts`, `./docs/<VERSION>/schema/config.ts`), following `assets/schemas.template.ts`. In each group schema file, import `API_VERSION`, `GENERATED_AT`, and any common schemas from `./common`:

```typescript
import { z } from "zod";
import { API_VERSION, GENERATED_AT } from "./common";
```

For every endpoint export schemas named after the route, e.g. for `GET /users/:id`:

```
getUserByIdParamsSchema     // only if there are path params
getUserByIdQuerySchema      // only if there are query params
getUserByIdResponseSchema
```

and for a body-carrying endpoint like `POST /users`:

```
createUserBodySchema
createUserResponseSchema
```

Read `references/zod-v4-notes.md` before writing schemas. Zod v4 moved string-format validators (email, uuid, url, datetime, ...) to top-level functions and unified error customization under a single `error` param — v3-style `.email()` / `message:` still runs but is deprecated, and the user asked for v4, so write v4-idiomatic schemas.

If a struct is shared across groups (e.g. a common track/playback-state shape used by both `spotify.ts` and `jellyfin.ts`), define it in `./docs/<VERSION>/schema/common.ts` and import it from the group files that need it, rather than duplicating or re-exporting it per group.

### 8. Diffing, Backward Compatibility & Changelog Generation

Before finalizing the schemas and OpenAPI specs:

1. **Diff Against Previous Version**:
   - Compare the newly extracted endpoints, fields, and types against the previous schema version (from `packages/radio-schema/src/schema` or previous `./docs/` version).

2. **Backward Compatibility via Deprecation Metadata**:
   - For keys or fields that existed in the previous schema but were removed or replaced in the new C++ backend, **do not hard-delete them**.
   - Keep older keys in the Zod schemas marked as `.optional()` and annotate them with `.meta({ deprecated: true, description: "Deprecated in v<VERSION>, replaced with <NEW_KEY_OR_REASON>" })`.

     ```typescript
     export const mySchema = z.object({
       oldKey: z.string().optional().meta({ deprecated: true, description: "Deprecated in v1.2.0, replaced with newKey" }),
       newKey: z.string(),
     });
     ```

   - In the OpenAPI 3.1 YAML spec, set `deprecated: true` and add description notes for deprecated endpoints/properties.

3. **Generate `./docs/<VERSION>/CHANGELOG.md`**:
   - Write a detailed changelog file at `./docs/<VERSION>/CHANGELOG.md` listing:
     - 🟢 **Added**: New endpoints, new fields, new query parameters.
     - 🟡 **Modified**: Type changes, required/optional status changes, path updates.
     - 🔴 **Deprecated / Replaced**: Older fields retained for backward compatibility with deprecation metadata.

### 9. Backup and Sync to Workspace Packages

After generating artifacts in `./docs/<VERSION>/`:

1. **Schema Backup & Sync (`@fh6rc/radio-schema` / `@fh6rc/ui`)**:
   - Locate the target schema directory (`packages/radio-schema/src/schema` or `@fh6rc/ui` schema folder).
   - **Create Backup (keep only 1 backup)**: If a `schema.bak` backup already exists, overwrite it with the current latest schema folder so only the most recent previous version is backed up.
   - **Replace Schemas**: Overwrite/copy the newly generated schemas from `./docs/<VERSION>/schema/` into `packages/radio-schema/src/schema/` (or `@fh6rc/ui`). Run `bun run gen-index` in `packages/radio-schema` if new schema files were added.

2. **OpenAPI Spec Backup & Sync (`apps/mock-server`)**:
   - Target location: `apps/mock-server/openapi.yaml`.
   - **Create Backup (keep only 1 backup)**: Copy `apps/mock-server/openapi.yaml` to `apps/mock-server/openapi.yaml.bak` (overwrite existing `.bak` file so only 1 backup is retained).
   - **Replace OpenAPI Spec**: Overwrite `apps/mock-server/openapi.yaml` with the newly generated `./docs/<VERSION>/openapi.yaml`.

### 10. Sanity-check before handing back

- Every field in the Zod schemas should trace to a specific line in the C++ source (or be explicitly marked deprecated for backward compatibility).
- Required/optional must match between the OpenAPI spec and the Zod schema for active fields.
- Names should match the JSON keys actually used on the wire, not necessarily the C++ member names, when the two differ (e.g. a C++ member `user_id` serialized as `"userId"` — use `userId`).

## Dry Run Mode (`--dry-run` / Preview)

If the user explicitly requests a **dry run** or **preview** (e.g. *"dry run generate-docs"*, *"preview generate-docs"*):

1. **Execute All Analysis Steps**: Perform parsing, type mapping, version/date resolution, schema/OpenAPI generation in-memory, and full diffing against existing workspace schemas.
2. **NO File System Modifications**: Do **NOT** create, modify, or delete any files in `./docs/`, `packages/radio-schema/`, or `apps/mock-server/`. Do **NOT** overwrite backups (`.bak`) or execute terminal commands (`bun run gen-index`).
3. **Present Dry Run Report**: Display:
   - 🏷️ **Target Version & Date**.
   - 📁 **File Actions Preview**: List files that *would* be created, modified, or backed up.
   - 📄 **Full CHANGELOG Preview**: Output the complete markdown content of the generated `CHANGELOG.md`.

## Output (Full Execution)

Save the OpenAPI spec to `./docs/<VERSION>/openapi.yaml`, the Zod schema files to `./docs/<VERSION>/schema/common.ts` and `./docs/<VERSION>/schema/<group>.ts`, and the version changelog to `./docs/<VERSION>/CHANGELOG.md`, creating `./docs/<VERSION>/` and `./docs/<VERSION>/schema/` directories as needed.

Perform the backup and replace steps:

- Back up current schema directory to `schema.bak` (keeping only 1 backup) and update `@fh6rc/radio-schema` / `@fh6rc/ui`.
- Back up `apps/mock-server/openapi.yaml` to `openapi.yaml.bak` (keeping only 1 backup) and update `apps/mock-server/openapi.yaml`.

Present the full set of updated files to the user. Briefly highlight changes from `./docs/<VERSION>/CHANGELOG.md` (Added/Modified/Deprecated), state that backups were refreshed, and flag any endpoint where the C++ source was ambiguous.
