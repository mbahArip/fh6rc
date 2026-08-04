import z from "zod";
import { AppStore } from "~/store/helper";

const NAME = "app_config";
const VERSION = 1;
const ACCENTS = {
  orange: {
    background: {
      light: "oklch(0.55 0.24 32.0)",
      dark: "oklch(0.62 0.24 32.0)",
    },
    foreground: {
      light: "oklch(0.99 0 0)",
      dark: "oklch(0.99 0 0)",
    },
  },

  chartreuse: {
    background: {
      light: "oklch(0.52 0.18 116.0)",
      dark: "oklch(0.60 0.18 116.0)",
    },
    foreground: {
      light: "oklch(0.99 0 0)",
      dark: "oklch(0.99 0 0)",
    },
  },

  emerald: {
    background: {
      light: "oklch(0.48 0.18 153.0)",
      dark: "oklch(0.58 0.18 153.0)",
    },
    foreground: {
      light: "oklch(0.99 0 0)",
      dark: "oklch(0.99 0 0)",
    },
  },

  teal: {
    background: {
      light: "oklch(0.48 0.15 182.0)",
      dark: "oklch(0.58 0.15 182.0)",
    },
    foreground: {
      light: "oklch(0.99 0 0)",
      dark: "oklch(0.99 0 0)",
    },
  },

  sky: {
    background: {
      light: "oklch(0.50 0.18 232.0)",
      dark: "oklch(0.60 0.18 232.0)",
    },
    foreground: {
      light: "oklch(0.99 0 0)",
      dark: "oklch(0.99 0 0)",
    },
  },

  violet: {
    background: {
      light: "oklch(0.50 0.24 277.0)",
      dark: "oklch(0.60 0.24 277.0)",
    },
    foreground: {
      light: "oklch(0.99 0 0)",
      dark: "oklch(0.99 0 0)",
    },
  },

  fuchsia: {
    background: {
      light: "oklch(0.52 0.24 310.0)",
      dark: "oklch(0.62 0.24 310.0)",
    },
    foreground: {
      light: "oklch(0.99 0 0)",
      dark: "oklch(0.99 0 0)",
    },
  },

  rose: {
    background: {
      light: "oklch(0.52 0.22 17.0)",
      dark: "oklch(0.62 0.22 17.0)",
    },
    foreground: {
      light: "oklch(0.99 0 0)",
      dark: "oklch(0.99 0 0)",
    },
  },
} as const;

export const appConfigStoreSchema = z.object({
  version: z.number().default(VERSION).describe("Database schema version"),

  // Mod Server options
  host: z
    .url()
    .default("http://127.0.0.1")
    .describe("IP address or URL of the system hosting Forza Horizon 6"),
  port: z.coerce
    .number("Port must be a valid number between 1 and 65535")
    .min(1, "Port must be between 1 and 65535")
    .max(65535, "Port must be between 1 and 65535")
    .default(8420)
    .describe("Network port utilized by the FH6 Universal Radio mod server"),
  pollingRate: z
    .number()
    .default(5000)
    .describe(
      "Frequency (in milliseconds) to check for game and radio status updates",
    ),

  // UI options
  languages: z
    .enum(["en", "id"])
    .default("en")
    .describe("Preferred display language for the application interface"),
  theme: z
    .enum(["light", "dark"])
    .default("dark")
    .describe("Visual color theme for the user interface"),
  accent: z
    .enum(
      Object.keys(ACCENTS) as [
        keyof typeof ACCENTS,
        ...Array<keyof typeof ACCENTS>,
      ],
    )
    .default("orange")
    .describe("Primary accent color used for UI elements"),
  motionSafe: z
    .boolean()
    .default(false)
    .describe(
      "Minimize visual motion and animations for enhanced accessibility",
    ),
  size: z
    .enum(["default", "compact"])
    .default("default")
    .describe("Overall layout density and scaling factor for UI elements"),

  // Telemetry options
  useAnalytics: z
    .boolean()
    .default(false)
    .describe(
      "Enable local app diagnostics, only non-sensitive data is tracked",
    ),
  sendAnalytics: z
    .boolean()
    .default(false)
    .describe("Share anonymous telemetry data to help improve Universal Radio"),

  // Integrations options
  useForzaTelemetry: z
    .boolean()
    .default(false)
    .describe(
      "Use Forza Horizon 6 telemetry for rich game state tracking (requires enabling Data Out in FH6 settings)",
    ),
  useDiscordRichPresence: z
    .boolean()
    .default(true)
    .describe(
      "Display your active radio station and track details on your Discord profile",
    ),
  presenceTemplate: z
    .object({
      idle: z
        .string()
        .default("Cruising in Horizon")
        .describe("Discord activity text shown when tuned in but idle"),
      playing: z
        .string()
        .default("Listening to {song}")
        .describe("Discord activity text shown when music is actively playing"),
    })
    .default({
      idle: "Cruising in Horizon",
      playing: "Listening to {song}",
    }),
  presenceIcon: z
    .enum(["fh6", "universal-radio", "companion"])
    .default("universal-radio")
    .describe("App icon badge displayed on your Discord profile activity"),

  // Media control shortcut
  allowControlShortcut: z
    .boolean()
    .default(true)
    .describe("Enable global keyboard shortcuts for radio media playback"),
  controlKey: z
    .object({
      prev: z
        .string()
        .default("MediaNext")
        .describe("Global shortcut key to jump to the previous track"),
      next: z
        .string()
        .default("MediaPrevious")
        .describe("Global shortcut key to skip to the next track"),
      playPause: z
        .string()
        .default("MediaPlayPause")
        .describe("Global shortcut key to toggle play/pause"),
      volumeUp: z
        .string()
        .default("VolumeUp")
        .describe("Global shortcut key to increase volume"),
      volumeDown: z
        .string()
        .default("VolumeDown")
        .describe("Global shortcut key to decrease volume"),
      volumeMute: z
        .string()
        .default("VolumeMute")
        .describe("Global shortcut key to mute/unmute audio"),
    })
    .default({
      prev: "MediaNext",
      next: "MediaPrevious",
      playPause: "MediaPlayPause",
      volumeUp: "VolumeUp",
      volumeDown: "VolumeDown",
      volumeMute: "VolumeMute",
    }),
  previousBehavior: z
    .enum(["previous", "restart-if-played", "restart"])
    .default("previous")
    .describe(
      "Action triggered when pressing Previous while a track is currently playing",
    ),
  previousBehaviorThreshold: z
    .number()
    .default(5000)
    .describe(
      "Playback duration threshold (in ms) required before Previous restarts the track",
    ),
});

class AppConfigStore extends AppStore<z.infer<typeof appConfigStoreSchema>> {
  public readonly accents = ACCENTS;

  constructor() {
    const defaultValue = appConfigStoreSchema.parse({});
    super({
      name: NAME,
      version: VERSION,
      default: defaultValue,
      schema: appConfigStoreSchema,
      migrations: {
        1: (old) => ({ ...defaultValue, ...old, version: 1 }),
      },
    });
  }
}
export const appConfigStore = new AppConfigStore();
