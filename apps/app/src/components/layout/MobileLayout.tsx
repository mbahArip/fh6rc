import { ScrollArea } from "@fh6rc/ui";
import * as React from "react";

export function MobileLayout({ children }: React.PropsWithChildren) {
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
    <main className="flex flex-col w-dvw h-dvh bg-background text-foreground antialiased overflow-hidden">
      <ScrollArea
        className="size-full"
        scrollFade={false}
        alwaysShowScrollbar={hasScrollY}
      >
        <div ref={contentRef} className="min-h-dvh flex flex-col w-full">
          {children}
        </div>
      </ScrollArea>
    </main>
  );
}


