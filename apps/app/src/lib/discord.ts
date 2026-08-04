import { invoke } from "@tauri-apps/api/core";
import log from "~/lib/logging";

export interface DiscordPresenceOptions {
  details?: string; // e.g. "Listening to Song"
  status?: string; // e.g. "Artist - Album", or idle text
  largeImageKey?: string; // e.g. "universal-radio"
}

export async function updateDiscordPresence(options: DiscordPresenceOptions) {
  try {
    await invoke("update_discord_presence", {
      details: options.details,
      status: options.status,
      largeImageKey: options.largeImageKey,
    });
  } catch (error) {
    log.error("Failed to update Discord presence:", error);
  }
}
