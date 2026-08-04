import { cn } from "@fh6rc/ui/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AnimatePresence,
  motion,
  type Transition,
  type Variants,
} from "motion/react";
import * as React from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import type z from "zod";
import { useAppConfig } from "~/hooks/use-app-config";
import { appConfigStoreSchema } from "~/store/appConfig.store";
import { Logo } from "../../shared/logo";
import { IntegrationsCard } from "./IntegrationsCard";
import { ReviewCard } from "./ReviewCard";
import { ServerCard } from "./ServerCard";
import { UICard } from "./UICard";
import { WelcomeCard } from "./WelcomeCard";

const onboardingSteps = [
  "welcome",
  "server",
  "ui",
  "integrations",
  "review",
] as const;

type OnboardingStep = (typeof onboardingSteps)[number];

const cardMotions: Variants = {
  init: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
    scale: 0.95,
  }),
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    scale: 0.95,
  }),
};

const cardTransition: Transition = {
  duration: 0.3,
};

export function Onboarding() {
  const [step, setStep] = React.useState<OnboardingStep>("welcome");
  const [direction, setDirection] = React.useState<number>(1);

  const form = useForm({
    resolver: zodResolver(appConfigStoreSchema),
    defaultValues: appConfigStoreSchema.parse({}),
    mode: "onChange",
  });
  const { updateConfig } = useAppConfig();
  const onSubmit = async (data: z.infer<typeof appConfigStoreSchema>) => {
    await updateConfig(data);
  };
  const onNextStep = React.useCallback((step: OnboardingStep) => {
    setDirection(1);
    setStep(step);
  }, []);
  const onPreviousStep = React.useCallback((step: OnboardingStep) => {
    setDirection(-1);
    setStep(step);
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center relative overflow-hidden select-none bg-background p-4 w-full h-full">
      <Logo
        layoutId="app-ambient-glow"
        className="absolute -top-1/4 size-80 blur-3xl pointer-events-none opacity-60"
        style={{
          filter:
            "saturate(2.5) blur(var(--blur-3xl)) drop-shadow(0 0 40px var(--primary))",
        }}
        animate={{
          opacity: [0.35, 0.65],
          scale: 2.1,
          y: [-10, 10],
        }}
        transition={{
          layout: { duration: 1.25, ease: "easeInOut" },
          scale: { duration: 1.25, ease: "easeInOut" },
          opacity: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
          y: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
        }}
      />

      {/* Header Container with Shifting Shared Logo */}
      <div className="relative z-10 flex flex-col pt-4 items-center justify-between flex-1 gap-4 text-center w-full">
        <Logo
          layoutId="app-logo"
          className="size-30 drop-shadow-2xl"
          transition={{
            layout: { duration: 1, ease: "easeInOut" },
          }}
        />
        <motion.div
          className="w-full flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <form
            className="w-full max-w-xl"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              {step === "welcome" && (
                <WelcomeCard
                  key="welcome"
                  motions={cardMotions}
                  transition={cardTransition}
                  direction={direction}
                  onNext={() => onNextStep("server")}
                  onSkip={form.handleSubmit(onSubmit)}
                />
              )}
              {step === "server" && (
                <ServerCard
                  key="server"
                  form={
                    form as UseFormReturn<z.infer<typeof appConfigStoreSchema>>
                  }
                  motions={cardMotions}
                  transition={cardTransition}
                  direction={direction}
                  onPrevious={() => onPreviousStep("welcome")}
                  onNext={() => onNextStep("ui")}
                />
              )}
              {step === "ui" && (
                <UICard
                  key="ui"
                  form={
                    form as UseFormReturn<z.infer<typeof appConfigStoreSchema>>
                  }
                  motions={cardMotions}
                  transition={cardTransition}
                  direction={direction}
                  onPrevious={() => onPreviousStep("server")}
                  onNext={() => onNextStep("integrations")}
                />
              )}
              {step === "integrations" && (
                <IntegrationsCard
                  key="integrations"
                  form={
                    form as UseFormReturn<z.infer<typeof appConfigStoreSchema>>
                  }
                  motions={cardMotions}
                  transition={cardTransition}
                  direction={direction}
                  onPrevious={() => onPreviousStep("ui")}
                  onNext={() => onNextStep("review")}
                />
              )}
              {step === "review" && (
                <ReviewCard
                  key="review"
                  form={
                    form as UseFormReturn<z.infer<typeof appConfigStoreSchema>>
                  }
                  motions={cardMotions}
                  transition={cardTransition}
                  direction={direction}
                  onPrevious={() => onPreviousStep("integrations")}
                />
              )}
            </AnimatePresence>
          </form>
          <div className="flex items-center justify-center gap-1">
            {onboardingSteps.map((v) => (
              <div
                key={`step-indicator/${v}`}
                className={cn(
                  "w-2 h-2 rounded-full bg-secondary border transition-[width, background-color] duration-300",
                  {
                    "bg-primary w-6 border-transparent": v === step,
                  },
                )}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
