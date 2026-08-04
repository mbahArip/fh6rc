import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useAppConfig } from "~/hooks/use-app-config";
import {
  type GameStateContext,
  gameStateContext,
} from "~/hooks/use-game-state";

export function GameStateProvider({ children }: React.PropsWithChildren) {
  const cfg = useAppConfig();
  const endpoint = React.useMemo<URL>(
    () => new URL(`/api/state`, `${cfg.config.host}:${cfg.config.port}`),
    [cfg.config],
  );
  const query = useQuery({
    queryKey: ["state"],
    queryFn: async () => {
      const res = await fetch(endpoint, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok)
        throw new Error(
          "Failed to fetch game state, make sure the game running or server config is correct.",
        );

      const data = (await res.json()) as object;
      return data;
    },
    enabled: cfg.status === "ready",
    retry: false,
    refetchInterval: cfg.config.pollingRate ?? 5000,
  });

  const value = React.useMemo<GameStateContext>(
    () => ({
      state: query.data ?? null,
      status: query.isLoading ? "loading" : query.error ? "error" : "connected",
      error: query.error?.message,
    }),
    [query],
  );

  return (
    <gameStateContext.Provider value={value}>
      {children}
    </gameStateContext.Provider>
  );
}
