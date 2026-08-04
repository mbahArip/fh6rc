import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  ScrollArea,
} from "@fh6rc/ui";
import { DialogClose } from "@fh6rc/ui/components/ui/dialog";
import { IconChevronRight, IconChevronsRight, IconX } from "@fh6rc/ui/icons";
import type { Transition, Variants } from "motion";
import { motion } from "motion/react";
import * as React from "react";
import { APP_NAME } from "~/constant";
import { useIsMobile } from "~/hooks/use-is-mobile";

type Props = {
  motions: Variants;
  transition: Transition;
  direction: number;
  onNext: () => void;
  onSkip: () => void;
};

const MotionCard = motion.create(Card);

export function WelcomeCard({
  motions,
  transition,
  direction,
  onNext,
  onSkip,
}: Props) {
  const isMobile = useIsMobile();
  const SkipTrigger = React.useMemo(
    () => (
      <Button
        className="w-full"
        variant={"secondary"}
        iconEnd={<IconChevronsRight />}
      >
        Skip
      </Button>
    ),
    [],
  );
  const SkipHeader = React.useMemo(
    () => ({
      title: "Are you sure want to skip?",
      description:
        "You can change every setting later from the settings screen",
    }),
    [],
  );
  const SkipConfirm = React.useMemo(
    () => (
      <Button
        variant={"destructive"}
        iconEnd={<IconChevronsRight />}
        onClick={onSkip}
      >
        Skip for now
      </Button>
    ),
    [onSkip],
  );
  const SkipCancel = React.useMemo(
    () => (
      <Button variant={"secondary"} iconStart={<IconX />}>
        Cancel
      </Button>
    ),
    [],
  );

  return (
    <MotionCard
      variants={motions}
      custom={direction}
      initial="init"
      animate="animate"
      exit="exit"
      key="card-step-welcome"
      transition={transition}
      className="w-full"
    >
      <CardHeader>
        <CardTitle>Welcome to {APP_NAME}</CardTitle>
        <CardDescription>Let&apos;s get you all set up!</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className={"w-full h-fit"}>
          <div className="flex flex-col gap-2 w-full max-h-[50dvh]">
            <Alert>
              <AlertTitle>Before we begin, please ensure:</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4 space-y-1 mt-2">
                  <li>
                    You have installed{" "}
                    <a
                      href="https://www.nexusmods.com/forzahorizon6/mods/215"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <b>FH6 Universal Radio</b>
                    </a>
                  </li>
                  <li>
                    <b>Forza Horizon 6</b> is currently running on your host
                  </li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-col">
        <Button
          onClick={onNext}
          className="w-full"
          variant={"default"}
          iconEnd={<IconChevronRight />}
        >
          Let&apos;s start
        </Button>
        {isMobile ? (
          <Drawer>
            <DrawerTrigger render={SkipTrigger} />
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{SkipHeader.title}</DrawerTitle>
                <DrawerDescription>{SkipHeader.description}</DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose render={SkipConfirm} />
                <DrawerClose render={SkipCancel} />
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog>
            <DialogTrigger render={SkipTrigger} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{SkipHeader.title}</DialogTitle>
                <DialogDescription>{SkipHeader.description}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={SkipCancel} />
                <DialogClose render={SkipConfirm} />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </MotionCard>
  );
}
