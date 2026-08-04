import { ScrollArea } from "@fh6rc/ui";
import * as React from "react";
import { Titlebar } from "../desktop/Titlebar";

export function DesktopLayout({ children }: React.PropsWithChildren) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [hasScrollY, setHasScrollY] = React.useState<boolean>(false);

  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setHasScrollY(el.scrollHeight > el.clientHeight);
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(el);
    window.addEventListener("resize", checkOverflow);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);

  return (
    <main className="flex flex-col w-dvw h-dvh bg-background text-foreground antialiased relative [--titlebar-height:--spacing(8)] overflow-hidden">
      <Titlebar />
      <div className="size-full">
        <ScrollArea
          className="size-full"
          scrollFade={false}
          alwaysShowScrollbar={hasScrollY}
        >
          <div
            ref={contentRef}
            className="min-h-[calc(100dvh-var(--titlebar-height))] flex flex-col w-full"
          >
            {children}
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}
