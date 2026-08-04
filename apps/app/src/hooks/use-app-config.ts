import * as React from "react";
import type { appConfigStore } from "~/store/appConfig.store";

export interface AppConfigContext {
  config: typeof appConfigStore.default;
  updateConfig: typeof appConfigStore.set;
  status: "loading" | "onboarding" | "ready";
}

export const appConfigContext = React.createContext<AppConfigContext | null>(
  null,
);

export function useAppConfig() {
  const ctx = React.useContext(appConfigContext);
  if (!ctx)
    throw new Error("useAppConfig must be used within AppConfigProvider");

  return ctx;
}
