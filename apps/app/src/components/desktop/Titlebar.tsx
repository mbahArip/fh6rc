import { Badge, Button } from "@fh6rc/ui";
import {
  IconMinus,
  IconSquare,
  IconSquares,
  IconTrash,
  IconX,
} from "@fh6rc/ui/icons";
import { cn } from "@fh6rc/ui/lib/utils";
import { getCurrentWindow } from "@tauri-apps/api/window";
import * as React from "react";
import { APP_NAME } from "~/constant";
import log from "~/lib/logging";
import { appConfigStore } from "~/store/appConfig.store";
import { Logo } from "../shared/logo";

export function Titlebar() {
  const [isMaximized, setIsMaximized] = React.useState<boolean>(false);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  React.useEffect(() => {
    let unlisten: (() => void) | undefined;

    async function setupWindow() {
      try {
        const appWindow = getCurrentWindow();
        setIsMaximized(await appWindow.isMaximized());
        unlisten = await appWindow.onResized(async () => {
          try {
            setIsMaximized(await appWindow.isMaximized());
          } catch {
            // ignore
          }
        });
      } catch (e) {
        log.warn("Tauri window API unavailable:", e);
      }
    }

    setupWindow();

    return () => {
      unlisten?.();
    };
  }, []);

  const onDeleteConfig = React.useCallback(async () => {
    try {
      setIsDeleting(true);
      await appConfigStore.clear();
      window.location.reload();
    } catch (e) {
      log.error("Failed to delete appConfig:", e);
      setIsDeleting(false);
    }
  }, []);

  const onMinimize = React.useCallback(async () => {
    try {
      const appWindow = getCurrentWindow();
      await appWindow.minimize();
    } catch (e) {
      log.error("Failed to minimize window:", e);
    }
  }, []);

  const onMaximize = React.useCallback(async () => {
    try {
      const appWindow = getCurrentWindow();
      await appWindow.toggleMaximize();
      setIsMaximized(await appWindow.isMaximized());
    } catch (e) {
      log.error("Failed to toggle maximize window:", e);
    }
  }, []);

  const onClose = React.useCallback(async () => {
    try {
      const appWindow = getCurrentWindow();
      await appWindow.close();
    } catch (e) {
      log.error("Failed to close window:", e);
    }
  }, []);

  return (
    <nav
      className={cn(
        "w-full fixed top-0 z-1000 h-(--titlebar-height) flex items-center justify-between select-none bg-background/0 backdrop-blur-none border-b-0 border-border/50",
      )}
    >
      <div
        data-tauri-drag-region
        className="flex-1 h-full flex gap-2 items-center px-2 text-xs text-muted-foreground font-medium cursor-default opacity-0"
      >
        <Logo className="size-6" />
        {APP_NAME}
        {import.meta.env.DEV && <Badge>Dev</Badge>}
      </div>
      <div className="flex items-center">
        {import.meta.env.DEV && (
          <Button
            variant={"ghost"}
            size={"icon"}
            className={
              "relative w-10 text-muted-foreground hover:text-destructive"
            }
            onClick={onDeleteConfig}
            isLoading={isDeleting}
            title="Delete appConfig store and reload"
            iconStart={<IconTrash className="size-4" />}
          />
        )}
        <Button
          variant={"ghost"}
          size={"icon"}
          className={"relative w-10 rounded-s-sm! rounded-e-none!"}
          onClick={onMinimize}
          iconStart={<IconMinus />}
        />
        <Button
          variant={"ghost"}
          size={"icon"}
          className={"relative w-10 rounded-none"}
          onClick={onMaximize}
          iconStart={
            <>
              <IconSquare
                className={cn(
                  "absolute group-hover:scale-110 transition duration-200 ease-in-out opacity-100 size-3.5",
                  { "opacity-0 scale-0": isMaximized },
                )}
              />
              <IconSquares
                className={cn(
                  "absolute group-hover:scale-110 transition duration-200 ease-in-out opacity-0 size-3.5 rotate-90",
                  { "opacity-100 scale-x-100": isMaximized },
                )}
              />
            </>
          }
        />
        <Button
          variant={"ghost"}
          size={"icon"}
          className={
            "relative w-10 rounded-e-sm! rounded-s-none! hover:text-destructive"
          }
          onClick={onClose}
          iconStart={<IconX />}
        />
      </div>
    </nav>
  );
}
