import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  type Transition,
  type Variants,
} from "motion/react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Onboarding } from "~/components/screens/Onboarding/Onboarding";
import { SplashScreen } from "~/components/screens/SplashScreen";
import {
  type AppConfigContext,
  appConfigContext,
} from "~/hooks/use-app-config";
import { appConfigStore } from "~/store/appConfig.store";

const forceStatus: AppConfigContext["status"] | null = null;

const fadeVariants: Variants = {
  initial: (status: AppConfigContext["status"]) => {
    if (status === "ready") {
      return { opacity: 0, scale: 0.98, filter: "blur(4px)" };
    }
    if (status === "onboarding") {
      return { opacity: 0, scale: 1, filter: "blur(0px)" };
    }
    return { opacity: 1, scale: 1, filter: "blur(0px)" };
  },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: (status: AppConfigContext["status"]) => {
    if (status === "ready") {
      return { opacity: 0, scale: 1.25, filter: "blur(4px)" };
    }
    if (status === "onboarding") {
      return { opacity: 0, scale: 1, filter: "blur(0px)" };
    }
    return { opacity: 0, scale: 1, filter: "blur(0px)" };
  },
};

const fadeTransition: Transition = { duration: 0.8, ease: "easeInOut" };

export function AppConfigProvider({ children }: React.PropsWithChildren) {
  const { setTheme } = useTheme();
  const [status, setStatus] =
    React.useState<AppConfigContext["status"]>("loading");
  const [config, setConfig] = React.useState<AppConfigContext["config"]>(
    appConfigStore.default,
  );
  const splashScreenDelay = React.useRef<number>(2 * 1000);

  const injectUITheme = React.useCallback(
    (config: AppConfigContext["config"]) => {
      setTheme(config.theme);

      const existingStyle = document.querySelector("#theme-color-scheme");
      if (existingStyle) existingStyle.remove();

      const accentData = appConfigStore.accents[config.accent];
      const style = document.createElement("style");
      style.id = `theme-color-scheme`;
      style.innerHTML = `:root{--primary: ${accentData.background.light} !important;--primary-foreground: ${accentData.foreground.light} !important;}.dark{--primary: ${accentData.background.dark} !important;--primary-foreground: ${accentData.foreground.dark} !important;}`;
      document.head.appendChild(style);
    },
    [setTheme],
  );
  const updateConfig = React.useCallback(
    async (payload: Parameters<typeof appConfigStore.set>[number]) => {
      await appConfigStore.set(payload);
      const newConfig = await appConfigStore.get();
      if (!newConfig) return;
      setConfig(newConfig);
      setStatus("ready");
    },
    [],
  );

  React.useEffect(() => {
    appConfigStore
      .get()
      .then(async (cfg) => {
        if (cfg) {
          injectUITheme(cfg);
          setConfig(cfg);
        }

        await new Promise((res) => setTimeout(res, splashScreenDelay.current));
        if (cfg) {
          setStatus("ready");
        } else {
          setStatus("onboarding");
        }
      })
      .catch(() => {
        setStatus("onboarding");
      });
  }, [injectUITheme]);

  const value = React.useMemo<AppConfigContext>(
    () => ({
      config,
      status,
      updateConfig,
    }),
    [config, status, updateConfig],
  );

  const activeStatus = forceStatus ?? status;

  return (
    <appConfigContext.Provider value={value}>
      <LayoutGroup>
        <MotionConfig
          reducedMotion={config.motionSafe ? "always" : "user"}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <AnimatePresence mode="popLayout" custom={activeStatus}>
            {activeStatus === "loading" && (
              <motion.div
                key="splash"
                custom={activeStatus}
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={fadeTransition}
                className="w-full min-h-dvh flex flex-col flex-1"
              >
                <SplashScreen />
              </motion.div>
            )}
            {activeStatus === "onboarding" && (
              <motion.div
                key="onboarding"
                custom={activeStatus}
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={fadeTransition}
                className="w-full min-h-dvh flex flex-col flex-1"
              >
                <Onboarding />
              </motion.div>
            )}
            {activeStatus === "ready" && (
              <motion.div
                key="ready"
                custom={activeStatus}
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={fadeTransition}
                className="w-full min-h-dvh flex flex-col flex-1"
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </MotionConfig>
      </LayoutGroup>
    </appConfigContext.Provider>
  );
}
