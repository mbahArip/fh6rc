"use client";

import { cn } from "@fh6rc/ui/lib/utils";
import { IconCheck } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Button } from "./button";

export type TransitionVariant =
  | "circle"
  | "square"
  | "triangle"
  | "diamond"
  | "hexagon"
  | "rectangle"
  | "star";

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  duration?: number;
  transitionVariant?: TransitionVariant;
  /** When true, the transition expands from the viewport center instead of the button center. */
  fromCenter?: boolean;
  /**
   * Controlled theme value. When provided, the parent owns persistence
   * (e.g. `next-themes`) and this component will not write to localStorage.
   */
  theme?: "light" | "dark";
  /** Called on toggle. Pair with `theme` for controlled usage. */
  onThemeChange?: (theme: "light" | "dark") => void;
}

function polygonCollapsed(cx: number, cy: number, vertexCount: number): string {
  const pairs = Array.from(
    { length: vertexCount },
    () => `${cx}px ${cy}px`,
  ).join(", ");
  return `polygon(${pairs})`;
}

function getThemeTransitionClipPaths(
  variant: TransitionVariant,
  cx: number,
  cy: number,
  maxRadius: number,
  viewportWidth: number,
  viewportHeight: number,
): [string, string] {
  switch (variant) {
    case "circle":
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${maxRadius}px at ${cx}px ${cy}px)`,
      ];
    case "square": {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const halfSide = Math.max(halfW, halfH) * 1.05;
      const end = [
        `${cx - halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy + halfSide}px`,
        `${cx - halfSide}px ${cy + halfSide}px`,
      ].join(", ");
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case "triangle": {
      const scale = maxRadius * 2.2;
      const dx = (Math.sqrt(3) / 2) * scale;
      const verts = [
        `${cx}px ${cy - scale}px`,
        `${cx + dx}px ${cy + 0.5 * scale}px`,
        `${cx - dx}px ${cy + 0.5 * scale}px`,
      ].join(", ");
      return [polygonCollapsed(cx, cy, 3), `polygon(${verts})`];
    }
    case "diamond": {
      // Slightly larger than the view-transition circle radius so axis-aligned coverage matches the circle reveal.
      const R = maxRadius * Math.SQRT2;
      const end = [
        `${cx}px ${cy - R}px`,
        `${cx + R}px ${cy}px`,
        `${cx}px ${cy + R}px`,
        `${cx - R}px ${cy}px`,
      ].join(", ");
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case "hexagon": {
      const R = maxRadius * Math.SQRT2;
      const verts: string[] = [];
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 3;
        verts.push(`${cx + R * Math.cos(a)}px ${cy + R * Math.sin(a)}px`);
      }
      return [polygonCollapsed(cx, cy, 6), `polygon(${verts.join(", ")})`];
    }
    case "rectangle": {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const end = [
        `${cx - halfW}px ${cy - halfH}px`,
        `${cx + halfW}px ${cy - halfH}px`,
        `${cx + halfW}px ${cy + halfH}px`,
        `${cx - halfW}px ${cy + halfH}px`,
      ].join(", ");
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case "star": {
      // Small overscan so the last frames never leave a 1px seam before the transition group ends.
      const R = maxRadius * Math.SQRT2 * 1.03;
      const innerRatio = 0.42;
      const starPolygon = (radius: number) => {
        const verts: string[] = [];
        for (let i = 0; i < 5; i++) {
          const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          verts.push(
            `${cx + radius * Math.cos(outerA)}px ${cy + radius * Math.sin(outerA)}px`,
          );
          const innerA = outerA + Math.PI / 5;
          verts.push(
            `${cx + radius * innerRatio * Math.cos(innerA)}px ${cy + radius * innerRatio * Math.sin(innerA)}px`,
          );
        }
        return `polygon(${verts.join(", ")})`;
      };
      const startR = Math.max(2, R * 0.025);
      return [starPolygon(startR), starPolygon(R)];
    }
    default:
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${maxRadius}px at ${cx}px ${cy}px)`,
      ];
  }
}

export interface RunThemeTransitionOptions {
  trigger?: HTMLElement | React.MouseEvent | { x: number; y: number } | null;
  duration?: number;
  transitionVariant?: TransitionVariant;
  fromCenter?: boolean;
  action: () => void;
}

export function runThemeViewTransition({
  trigger,
  duration = 400,
  transitionVariant = "circle",
  fromCenter = false,
  action,
}: RunThemeTransitionOptions) {
  if (typeof document.startViewTransition !== "function") {
    action();
    return;
  }

  const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

  let x: number;
  let y: number;

  if (fromCenter) {
    x = viewportWidth / 2;
    y = viewportHeight / 2;
  } else if (
    trigger &&
    "clientX" in trigger &&
    typeof trigger.clientX === "number"
  ) {
    x = trigger.clientX;
    y = trigger.clientY;
  } else if (
    trigger &&
    "x" in trigger &&
    typeof (trigger as { x: number; y: number }).x === "number"
  ) {
    x = (trigger as { x: number; y: number }).x;
    y = (trigger as { x: number; y: number }).y;
  } else if (trigger && trigger instanceof HTMLElement) {
    const { top, left, width, height } = trigger.getBoundingClientRect();
    x = left + width / 2;
    y = top + height / 2;
  } else {
    x = viewportWidth / 2;
    y = viewportHeight / 2;
  }

  const maxRadius = Math.hypot(
    Math.max(x, viewportWidth - x),
    Math.max(y, viewportHeight - y),
  );

  const clipPath = getThemeTransitionClipPaths(
    transitionVariant,
    x,
    y,
    maxRadius,
    viewportWidth,
    viewportHeight,
  );

  const root = document.documentElement;
  root.dataset.magicuiThemeVt = "active";
  root.style.setProperty("--magicui-theme-toggle-vt-duration", `${duration}ms`);
  root.style.setProperty("--magicui-theme-vt-clip-from", clipPath[0]);

  const cleanup = () => {
    delete root.dataset.magicuiThemeVt;
    root.style.removeProperty("--magicui-theme-toggle-vt-duration");
    root.style.removeProperty("--magicui-theme-vt-clip-from");
  };

  const transition = document.startViewTransition(() => {
    flushSync(action);
  });

  if (typeof transition?.finished?.finally === "function") {
    transition.finished.finally(cleanup);
  } else {
    cleanup();
  }

  const ready = transition?.ready;
  if (ready && typeof ready.then === "function") {
    ready.then(() => {
      document.documentElement.animate(
        {
          clipPath,
        },
        {
          duration,
          easing: transitionVariant === "star" ? "linear" : "ease-in-out",
          fill: "forwards",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }
}

export const ThemeButton = ({
  className,
  duration = 400,
  transitionVariant,
  fromCenter = false,
  theme,
  onThemeChange,
  ...props
}: AnimatedThemeTogglerProps) => {
  const shape = transitionVariant ?? "circle";
  const isControlled = theme !== undefined;
  const [internalIsDark, setInternalIsDark] = useState(false);
  const isDark = isControlled ? theme === "dark" : internalIsDark;
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isControlled) return;

    const updateTheme = () => {
      setInternalIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [isControlled]);

  const toggleTheme = useCallback(() => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    const isTargetDark = isControlled ? theme === "dark" : !isCurrentlyDark;

    runThemeViewTransition({
      trigger: buttonRef.current,
      duration,
      transitionVariant: shape,
      fromCenter,
      action: () => {
        if (isControlled) {
          document.documentElement.classList.toggle("dark", isTargetDark);
          onThemeChange?.(theme);
        } else {
          const newTheme = !isDark;
          document.documentElement.classList.toggle("dark", newTheme);
          setInternalIsDark(newTheme);
          localStorage.setItem("theme", newTheme ? "dark" : "light");
        }
      },
    });
  }, [shape, fromCenter, duration, isDark, isControlled, theme, onThemeChange]);

  return (
    <Button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(className)}
      {...props}
    />
  );
};

export interface AccentSelectorButtonProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  background?: string;
  foreground?: string;
  active?: boolean;
  duration?: number;
  transitionVariant?: TransitionVariant;
  fromCenter?: boolean;
  onSelect?: () => void;
}

export const AccentSelectorButton = ({
  className,
  background,
  foreground,
  active = false,
  duration = 400,
  transitionVariant,
  fromCenter = false,
  onSelect,
  onClick,
  children,
  ...props
}: AccentSelectorButtonProps) => {
  const shape = transitionVariant ?? "circle";
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (active) return;
      runThemeViewTransition({
        trigger: buttonRef.current,
        duration,
        transitionVariant: shape,
        fromCenter,
        action: () => {
          onSelect?.();
          (onClick as React.MouseEventHandler<HTMLButtonElement>)?.(e);
        },
      });
    },
    [shape, fromCenter, duration, onSelect, onClick, active],
  );

  return (
    <Button
      type="button"
      ref={buttonRef}
      onClick={handleClick}
      variant="ghost"
      size="icon"
      className={cn(
        "relative ring-1 ring-(--accent-color) rounded-full bg-primary size-8 p-0 cursor-pointer hover:bg-primary! border-none!",
        {
          "ring-2 ring-primary cursor-default": active,
        },
        className,
      )}
      {...props}
      style={
        {
          "--accent-color": background,
        } as React.CSSProperties
      }
    >
      {background && (
        <div
          className="absolute inset-0 size-full pointer-events-none rounded-full"
          style={{
            background,
            maskImage: "linear-gradient(-45deg, transparent 50%, black 50%)",
            WebkitMaskImage:
              "linear-gradient(-45deg, transparent 50%, black 50%)",
          }}
        />
      )}
      {foreground && (
        <div
          className="absolute inset-0 size-full pointer-events-none rounded-full"
          style={{
            background: foreground,
            maskImage: "linear-gradient(-45deg, black 50%, transparent 50%)",
            WebkitMaskImage:
              "linear-gradient(-45deg, black 50%, transparent 50%)",
          }}
        />
      )}
      <div
        className={cn(
          "absolute grid rounded-full z-1 inset-0 size-full ring-1 ring-primary/50 transition-opacity duration-300  place-items-center pointer-events-none",
          {
            "opacity-100 bg-background/60": active,
            "opacity-0": !active,
          },
        )}
      >
        <IconCheck className="size-5" />
      </div>
      {children}
    </Button>
  );
};
