# Contributing to fh6rc

This document provides architectural context, setup instructions, and development guidelines for contributing to **fh6rc**.

---

## Architecture Overview

The repository is structured as a TypeScript monorepo managed with **Bun** and **Turborepo**.

```
fh6rc/
├── apps/
│   ├── app/                # Main desktop application (Tauri v2, React 19, Vite, Tailwind CSS v4)
│   ├── web/                # Web application (Next.js)
│   └── mock-server/        # Local mock API server (OpenAPI 3.1 compliant)
├── packages/
│   ├── radio-schema/       # Shared Zod v4 validation schemas and TypeScript types (@fh6rc/radio-schema)
│   ├── ui/                 # Shared UI component library (shadcn/ui)
│   ├── biome-config/       # Workspace linting and formatting rules
│   └── typescript-config/  # Shared TSConfig presets
├── deps/
│   └── fh6-universal-radio/# [Optional] C++ mod server source code for contract generation
├── scripts/
│   └── pull-deps.ts        # Dependency synchronization script (bun run deps:sync)
├── docs/                   # Versioned API contracts, OpenAPI specifications, and changelogs
└── .agents/skills/         # Automated agent skills and development workflows
```

### Technology Stack

- **Runtime & Package Manager:** Bun (`v1.3.14`)
- **Monorepo Orchestration:** Turborepo
- **Code Quality:** Biome (linting and formatting)
- **Desktop Framework:** Tauri v2, React 19
- **Validation & Types:** Zod v4
- **Local API Simulation:** OpenAPI 3.1 mock server (`apps/mock-server`)

---

## Core Development Concepts

### 1. Mock Server vs. Live Mod Server

Developing against the live `fh6-universal-radio` C++ mod server requires running Forza Horizon simultaneously, which is resource-intensive.

- **Use the Mock Server for UI Development:** The mock server (`apps/mock-server`) simulates all REST endpoints, Server-Sent Events (SSE), and playback states without requiring the game to be open.
- **Start the Mock Server:** `bun dev --filter mock-server`

### 2. Optional Dependencies Directory (`./deps/`)

- The `./deps/fh6-universal-radio/` directory is **optional** for standard frontend or UI development.
- You only need to synchronize this directory (`bun run deps:sync`) when inspecting a newer mod release or regenerating API validation schemas.

### 3. Synchronizing API Contracts (`/generate-docs`)

When adding support for a new release of the `fh6-universal-radio` mod:

- Use the `/generate-docs` command to parse the C++ backend source (`./deps/fh6-universal-radio/src/http/http_server.cpp`) and automatically generate updated OpenAPI 3.1 specifications and Zod v4 schemas.
- Use `/generate-docs can you do dry run` to preview contract diffs and changelogs without writing to disk.

---

## Getting Started

### Prerequisites

- **Bun** (`>= 1.3.14`)
- **Git**

### Workspace Setup

```bash
# Install workspace dependencies
bun install

# (Optional) Synchronize C++ backend source files for schema generation
bun run deps:sync
```

### Development Commands

```bash
# Start all applications in development mode
bun dev

# Start only the desktop application
bun dev --filter @fh6rc/app

# Start only the local mock API server
bun dev --filter mock-server
```

---

## Development Workflows

### Code Quality and Linting

We use **Biome** across the monorepo to maintain consistent formatting and catch errors early.

```bash
# Run type checking across all packages
bun run check-types

# Lint the codebase
bun run lint

# Automatically format source files
bun run format

# Build all workspace packages and applications
bun run build
```

Ensure that `bun run check-types` and `bun run lint` pass cleanly before submitting code changes.

---

### Syncing C++ Backend Contracts

The C++ implementation at `./deps/fh6-universal-radio/src/http/http_server.cpp` serves as the single source of truth for all API data models.

To update frontend contracts after a C++ backend change:

1. Sync the latest C++ source: `bun run deps:sync`
2. Preview changes: `/generate-docs can you do dry run`
3. Apply updates: `/generate-docs`

This command updates:

- Zod v4 schemas in `packages/radio-schema/src/schema/`
- OpenAPI 3.1 definitions in `apps/mock-server/openapi.yaml`
- Versioned API documentation in `docs/<VERSION>/`
- Package index exports in `packages/radio-schema`

---

### UI Component Library (`@fh6rc/ui`)

All shared UI components are located in `packages/ui`. To add a new shadcn component:

```bash
bun --filter @fh6rc/ui ui add <component-name>
```

- Keep components modular and reusable across desktop and web interfaces.
- Use Zod schemas from `@fh6rc/radio-schema` for data props and form validation.
- Follow Tailwind CSS v4 styling conventions.

---

### Managing Package Dependencies

```bash
# Add a production dependency to the main desktop application
bun add <package> --filter @fh6rc/app

# Add a development dependency to the shared UI library
bun add -d <package> --filter @fh6rc/ui

# Re-link workspaces after modifications
bun install
```

---

## Contribution Guidelines

1. **Single Source of Truth for Types:**
   - Always import domain types and validation schemas from `@fh6rc/radio-schema`.
   - Avoid redefining duplicate API interfaces in component files.

2. **Backward Compatibility:**
   - When updating Zod schemas, deprecate obsolete properties using `.meta({ deprecated: true })` rather than deleting them immediately, ensuring older client states do not break.

3. **Pre-Submission Checks:**
   - Run `bun run check-types` and `bun run build` locally to verify build integrity.
   - Test UI interactions against `apps/mock-server`.

4. **Conventional Commits:**
   Format commit messages according to the Conventional Commits specification:
   - `feat(app): add online radio station selection modal`
   - `fix(radio-schema): correct playback duration response type`
   - `docs(api): update OpenAPI specification for v1.1.10`
   - `refactor(ui): extract virtualized track list component`
