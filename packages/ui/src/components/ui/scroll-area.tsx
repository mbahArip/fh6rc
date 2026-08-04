import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cn } from "@fh6rc/ui/lib/utils";

function ScrollArea({
  className,
  children,
  scrollFade = true,
  orientation = "vertical",
  alwaysShowScrollbar = false,
  ...props
}: ScrollAreaPrimitive.Root.Props & {
  /**
   * Enable/disable the scroll-fade edge mask.
   * Uses the shadcn `scroll-fade` CSS utility (CSS scroll-driven animations, zero JS).
   * Default: true
   */
  scrollFade?: boolean;
  /**
   * Always show the scrollbar (disable auto-hiding when idle).
   * Default: false
   */
  alwaysShowScrollbar?: boolean;
  /**
   * Which axis to apply the fade to.
   * - "vertical" → `scroll-fade` (top + bottom)
   * - "horizontal" → `scroll-fade-x` (start + end)
   * - "both" → `scroll-fade scroll-fade-x`
   * Default: "vertical"
   */
  orientation?: "vertical" | "horizontal" | "both";
}) {
  const fadeClass = scrollFade
    ? orientation === "horizontal"
      ? "scroll-fade-x"
      : orientation === "both"
        ? "scroll-fade scroll-fade-x"
        : "scroll-fade"
    : undefined;

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
          fadeClass,
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar alwaysShow={alwaysShowScrollbar} />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  alwaysShow = false,
  keepMounted,
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props & { alwaysShow?: boolean }) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      data-always-visible={alwaysShow ? "true" : undefined}
      keepMounted={alwaysShow || keepMounted}
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent",
        alwaysShow &&
          "data-[state=hidden]:opacity-0! data-[state=hidden]:pointer-events-none! data-[state=visible]:opacity-100! pointer-events-auto!",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border"
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export { ScrollArea, ScrollBar };
