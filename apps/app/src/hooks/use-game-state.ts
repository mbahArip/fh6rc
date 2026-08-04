import * as React from "react";

export interface GameStateContext {
  state: object | null;
  status: "loading" | "error" | "connected";
  error?: string;
}

export const gameStateContext = React.createContext<GameStateContext | null>(
  null,
);

export function useGameState() {
  const ctx = React.useContext(gameStateContext);
  if (!ctx)
    throw new Error("useGameState must be used within GameStateProvider");

  return ctx;
}
