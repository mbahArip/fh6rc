import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ScrollArea,
  Separator,
} from "@fh6rc/ui";
import {
  IconAccessible,
  IconAccessibleFilled,
  IconActivity,
  IconAdjustments,
  IconBrandDiscord,
  IconBrandDiscordFilled,
  IconChevronLeft,
  IconCircleHalf2,
  IconDeviceFloppyFilled,
  IconGauge,
  IconGaugeFilled,
  IconLanguage,
  IconMoonFilled,
  IconPlug,
  IconPuzzle,
  IconSend,
  IconSendFilled,
  IconServer,
  IconSunFilled,
} from "@fh6rc/ui/icons";
import type { Transition, Variants } from "motion";
import { motion } from "motion/react";
import type { UseFormReturn } from "react-hook-form";
import type z from "zod";
import {
  appConfigStore,
  type appConfigStoreSchema,
} from "~/store/appConfig.store";

type Props = {
  motions: Variants;
  transition: Transition;
  direction: number;
  onPrevious: () => void;
  form: UseFormReturn<z.infer<typeof appConfigStoreSchema>>;
};

const MotionCard = motion.create(Card);

export function ReviewCard({
  motions,
  transition,
  direction,
  onPrevious,
  form,
}: Props) {
  const accent = form.getValues("accent");
  const theme = form.getValues("theme");
  const accentColor = appConfigStore.accents[accent];

  return (
    <MotionCard
      variants={motions}
      custom={direction}
      initial="init"
      animate="animate"
      exit="exit"
      key="card-step-review"
      transition={transition}
      className="w-full"
    >
      <CardHeader>
        <CardTitle>Review Configuration</CardTitle>
        <CardDescription>
          Let&apos;s take a look at what you&apos;ve selected.
          <br />
          You can always change these later in the settings menu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className={"w-full h-fit"}>
          <div className="flex flex-col gap-4 pr-4 w-full">
            {/* Server Settings */}
            <div className="flex flex-col w-full gap-2">
              <div className="flex items-center gap-2 text-start">
                <span className="text-base font-medium">Server Settings</span>
                <IconServer className="size-4" />
              </div>
              <div className="flex flex-col w-full gap-2.5 px-4 py-3 bg-muted/50 border rounded-lg">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Host</span>
                  <Separator className={"flex-1"} />
                  <Badge variant="outline" className="font-mono gap-1.5">
                    {form.getValues("host")}
                    <IconServer className="size-4" />
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Port</span>
                  <Separator className={"flex-1"} />
                  <Badge variant="outline" className="font-mono gap-1.5">
                    {form.getValues("port")}
                    <IconPlug className="size-4" />
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* App Settings */}
            <div className="flex flex-col w-full gap-2">
              <div className="flex items-center gap-2 text-start">
                <span className="text-base font-medium">App Settings</span>
                <IconAdjustments className="size-4" />
              </div>

              <div className="flex flex-col w-full gap-2.5 px-4 py-3 bg-muted/50 border rounded-lg">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Theme</span>
                  <Separator className={"flex-1"} />
                  <Badge variant="outline" className="capitalize gap-1.5">
                    {theme}
                    {theme === "light" ? (
                      <IconSunFilled className="size-4" />
                    ) : (
                      <IconMoonFilled className="size-4" />
                    )}
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Accent Color</span>
                  <Separator className={"flex-1"} />
                  <Badge variant="outline" className="capitalize gap-1.5">
                    {accent}
                    <IconCircleHalf2
                      className="rotate-45 size-4"
                      style={{
                        fill: accentColor.background[theme],
                        color: accentColor.foreground[theme],
                      }}
                    />
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Language</span>
                  <Separator className={"flex-1"} />
                  <Badge variant="outline" className="gap-1.5">
                    {form.getValues("languages") === "en"
                      ? "English"
                      : "Bahasa Indonesia"}
                    <IconLanguage className="size-4" />
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Reduced Motion</span>
                  <Separator className={"flex-1"} />
                  {form.getValues("motionSafe") ? (
                    <Badge variant="secondary" className="gap-1.5">
                      Enabled
                      <IconAccessibleFilled className="size-4" />
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="gap-1.5 text-muted-foreground"
                    >
                      Disabled
                      <IconAccessible className="size-4" />
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Integrations Settings */}
            <div className="flex flex-col w-full gap-2">
              <div className="flex items-center gap-2 text-start">
                <span className="text-base font-medium">
                  Integrations Settings
                </span>
                <IconPuzzle className="size-4" />
              </div>

              <div className="flex flex-col w-full gap-2.5 px-4 py-3 bg-muted/50 border rounded-lg">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Allow Analytics</span>
                  <Separator className={"flex-1"} />
                  {form.getValues("useAnalytics") ? (
                    <Badge variant="secondary" className="gap-1.5">
                      Enabled
                      <IconActivity className="size-4" />
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="gap-1.5 text-muted-foreground"
                    >
                      Disabled
                      <IconActivity className="size-4" />
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Send Usage Data</span>
                  <Separator className={"flex-1"} />
                  {form.getValues("sendAnalytics") ? (
                    <Badge variant="secondary" className="gap-1.5">
                      Enabled
                      <IconSendFilled className="size-4" />
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="gap-1.5 text-muted-foreground"
                    >
                      Disabled
                      <IconSend className="size-4" />
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Discord Rich Presence
                  </span>
                  <Separator className={"flex-1"} />
                  {form.getValues("useDiscordRichPresence") ? (
                    <Badge variant="secondary" className="gap-1.5">
                      Enabled
                      <IconBrandDiscordFilled className="size-4" />
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="gap-1.5 text-muted-foreground"
                    >
                      Disabled
                      <IconBrandDiscord className="size-4" />
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Forza Telemetry</span>
                  <Separator className={"flex-1"} />
                  {form.getValues("useForzaTelemetry") ? (
                    <Badge variant="secondary" className="gap-1.5">
                      Enabled
                      <IconGaugeFilled className="size-4" />
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="gap-1.5 text-muted-foreground"
                    >
                      Disabled
                      <IconGauge className="size-4" />
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onPrevious}
          variant={"secondary"}
          iconStart={<IconChevronLeft />}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          isLoading={form.formState.isSubmitting}
          variant={"default"}
          iconStart={<IconDeviceFloppyFilled />}
          className="flex-1"
        >
          Save
        </Button>
      </CardFooter>
    </MotionCard>
  );
}
