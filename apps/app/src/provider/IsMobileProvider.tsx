import { IconLoader2 } from "@fh6rc/ui/icons";
import { platform } from "@tauri-apps/plugin-os";
import * as React from "react";
import { isMobileContext } from "~/hooks/use-is-mobile";

export function IsMobileProvider({ children }: React.PropsWithChildren) {
  const [mounted, setMounted] = React.useState<boolean>(false);
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const currentPlatform = platform();

    if (currentPlatform === "android" || currentPlatform === "ios")
      setIsMobile(true);

    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div className="w-dvw h-dvh grid place-items-center">
        <IconLoader2 className="size-10 animate-spin" />
      </div>
    );

  return (
    <isMobileContext.Provider value={isMobile}>
      {children}
    </isMobileContext.Provider>
  );
}
