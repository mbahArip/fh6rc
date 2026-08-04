# C++ → OpenAPI → Zod v4 type mapping

| C++ type | OpenAPI (JSON Schema) | Zod v4 |
| --- | --- | --- |
| `bool` | `type: boolean` | `z.boolean()` |
| `int`, `int32_t`, `short` | `type: integer, format: int32` | `z.int32()` |
| `int64_t`, `long long` | `type: integer, format: int64` | `z.int64()` (or `z.bigint()` if it can exceed JS's safe integer range) |
| `unsigned int`, `uint32_t` | `type: integer, format: int32, minimum: 0` | `z.int32().nonnegative()` |
| `float` | `type: number, format: float` | `z.number()` |
| `double` | `type: number, format: double` | `z.number()` |
| `std::string` | `type: string` | `z.string()` |
| `std::string` holding an email | `type: string, format: email` | `z.email()` |
| `std::string` holding a UUID | `type: string, format: uuid` | `z.uuid()` (use `z.guid()` instead if the C++ side accepts loosely-formatted UUIDs, since `z.uuid()` is strict about RFC 9562/4122 variant bits) |
| `std::string` holding a URL | `type: string, format: uri` | `z.url()` |
| ISO date string | `type: string, format: date` | `z.iso.date()` |
| ISO datetime string | `type: string, format: date-time` | `z.iso.datetime()` |
| `std::chrono::system_clock::time_point` (serialized as ISO string) | `type: string, format: date-time` | `z.iso.datetime()` |
| `std::chrono::system_clock::time_point` (serialized as epoch seconds/ms) | `type: integer` | `z.number().int()` |
| `enum class Foo { A, B }` (serialized as string) | `type: string, enum: [A, B]` | `z.enum(["A", "B"])` |
| `enum class Foo` (serialized as its underlying int) | `type: integer, enum: [0, 1]` | `z.union([z.literal(0), z.literal(1)])` |
| `std::optional<T>` | field not in the `required` array | `.optional()` on the field's schema |
| pointer that can be null (`T*`, `std::shared_ptr<T>`) used to mean "may be absent" | `nullable: true` (OpenAPI 3.1: `type: [T, "null"]`) or not `required`, depending on whether it's "absent" or "present-but-null" in the JSON | `.nullable()` and/or `.optional()` to match |
| `std::vector<T>` | `type: array, items: <T>` | `z.array(<T>)` |
| `std::array<T, N>` | `type: array, items: <T>, minItems: N, maxItems: N` | `z.array(<T>).length(N)` |
| `std::map<std::string, T>` / `std::unordered_map<std::string, T>` | `type: object, additionalProperties: <T>` | `z.record(z.string(), <T>)` |
| custom `struct`/`class` serialized as a JSON object | `type: object` with its own named schema, referenced via `$ref` | a separate named `z.object({...})`, referenced (not inlined) wherever it's reused |
| `std::variant<A, B>` / tagged union serialized with a discriminator field | `oneOf` with `discriminator` | `z.discriminatedUnion("<tag>", [...])` |
| raw JSON passthrough (`nlohmann::json`, `Json::Value`, etc. stored/forwarded without a fixed shape) | `type: object` (untyped) — note in the spec that the shape is dynamic | `z.record(z.string(), z.unknown())` or `z.unknown()`, and say explicitly that this field's shape isn't fixed rather than inventing one |

## Notes

- **Required vs. optional** is a property of the *field*, decided in step 3 of the main workflow (SKILL.md) by reading how the C++ code accesses it — this table only tells you the base type once that's settled.
- When a `struct` is reused across multiple endpoints (e.g. a `User` struct that appears in both `POST /users` and `GET /users/:id`), define its schema once and reference it from both places in both the OpenAPI spec and the Zod file, rather than duplicating the field list.
- If a C++ type's JSON representation genuinely can't be determined from the file (e.g. a templated serializer defined elsewhere, or a type whose `to_json` isn't visible), say so rather than guessing — see the sanity-check step in SKILL.md.
