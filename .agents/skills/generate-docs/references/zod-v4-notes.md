# Writing v4-idiomatic Zod schemas

Zod v4 kept most of the v3 API working (deprecated, not removed), so it's easy to accidentally write v3-style schemas that still run fine but aren't what was asked for. Use the v4 forms below.

## String formats are top-level functions, not `.string()` methods

| v3 (deprecated in v4, still works) | v4 |
| --- | --- |
| `z.string().email()` | `z.email()` |
| `z.string().uuid()` | `z.uuid()` (stricter — validates RFC 9562/4122 variant bits; use `z.guid()` for the old, looser 8-4-4-4-12 hex check) |
| `z.string().url()` | `z.url()` |
| `z.string().datetime()` | `z.iso.datetime()` |
| `z.string().date()` | `z.iso.date()` |
| `z.string().time()` | `z.iso.time()` |
| `z.string().uuid()` (v4/v7/v8 specific) | `z.uuidv4()`, `z.uuidv7()`, `z.uuidv8()` |
| — | `z.emoji()`, `z.base64()`, `z.base64url()`, `z.nanoid()`, `z.cuid()`, `z.cuid2()`, `z.ulid()`, `z.ipv4()`, `z.ipv6()`, `z.cidrv4()`, `z.cidrv6()`, `z.e164()`, `z.jwt()` — all top-level in v4, no v3 equivalent needed

## Error customization: one `error` param, not several

```ts
// v3 style — deprecated, don't write this for a v4 ask
z.string({ required_error: "This field is required", invalid_type_error: "Not a string" });
z.string().min(1, { message: "Too short" });

// v4 — use this
z.string({ error: (issue) => issue.input === undefined ? "This field is required" : "Not a string" });
z.string().min(1, { error: "Too short" });
```

`invalid_type_error` and `required_error` were dropped entirely in v4 — there's no `required` issue code to map them to. A plain string is also accepted for `error` for the common case (no need for the function form unless the message actually depends on the failure reason).

## `.strict()` / `.passthrough()` → object-level functions

```ts
// v3
z.object({...}).strict();
z.object({...}).passthrough();

// v4
z.strictObject({...});
z.looseObject({...});
```

## `z.record()` now takes two arguments

```ts
// v3
z.record(z.string());

// v4 — key schema is now required
z.record(z.string(), z.string());
```

For a record keyed by a specific enum where not every key is guaranteed present, use `z.partialRecord(MyEnum, valueSchema)` instead of `z.record`.

## Coercion input type

`z.coerce.string()` (and other `z.coerce.*`) now types its input as `unknown` rather than the target type — this only matters for the generated TypeScript types, not the runtime behavior, so it doesn't change how you write the schema itself.

## Practical checklist for this skill's output

- Use top-level string-format functions (`z.email()`, `z.uuid()`, `z.iso.datetime()`, ...), not the `.string().xxx()` chained forms.
- Use `error`, not `message` / `required_error` / `invalid_type_error`, for any custom validation messages.
- Use `z.strictObject({...})` when the C++ side rejects unknown JSON fields, `z.object({...})` (default: strips unknown keys) or `z.looseObject({...})` when it doesn't care.
- Export every named schema (`export const createUserBodySchema = z.object({...})`) so it can be imported and reused, and derive the TypeScript type alongside it with `z.infer`:

  ```ts
  export const createUserBodySchema = z.object({ ... });
  export type CreateUserBody = z.infer<typeof createUserBodySchema>;
  ```
