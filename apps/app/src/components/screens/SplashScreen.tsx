import { Logo } from "../shared/logo";

export function SplashScreen() {
  return (
    <div className="flex flex-1 flex-col max-h-dvh items-center justify-center relative overflow-hidden select-none bg-background w-full h-full">
      <Logo
        layoutId="app-ambient-glow"
        className="absolute size-80 blur-3xl pointer-events-none opacity-60"
        style={{
          filter:
            "saturate(2.5) blur(var(--blur-3xl)) drop-shadow(0 0 40px var(--primary))",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: 1.8,
        }}
        exit={{
          opacity: 0.4,
        }}
        transition={{
          duration: 1.25,
          ease: "easeInOut",
          layout: { duration: 1.25, ease: "easeInOut" },
          opacity: {
            duration: 2,
            ease: "easeInOut",
          },
          scale: {
            damping: 120,
            stiffness: 180,
            type: "spring",
          },
        }}
      />

      <div className="relative z-10">
        <Logo
          layoutId="app-logo"
          className="size-30 drop-shadow-2xl"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.25,
            scale: { duration: 1, ease: "easeInOut" },
            layout: { duration: 1.25, ease: "easeInOut" },
          }}
        />
      </div>
    </div>
  );
}
