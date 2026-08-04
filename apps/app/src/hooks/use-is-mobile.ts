import * as React from "react";

export const isMobileContext = React.createContext<boolean | undefined>(
  undefined,
);

export function useIsMobile(): boolean {
  const ctx = React.useContext(isMobileContext);
  if (ctx === undefined) {
    throw new Error("useIsMobile must be used within IsMobileProvider");
  }

  return ctx;
}
