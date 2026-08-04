import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  ScrollArea,
  Switch,
} from "@fh6rc/ui";
import { IconChevronLeft, IconChevronRight } from "@fh6rc/ui/icons";
import type { Transition, Variants } from "motion";
import { motion } from "motion/react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type z from "zod";
import { appConfigStoreSchema } from "~/store/appConfig.store";

type Props = {
  motions: Variants;
  transition: Transition;
  direction: number;
  onPrevious: () => void;
  onNext: () => void;
  form: UseFormReturn<z.infer<typeof appConfigStoreSchema>>;
};

const MotionCard = motion.create(Card);

export function IntegrationsCard({
  motions,
  transition,
  direction,
  onPrevious,
  onNext,
  form,
}: Props) {
  return (
    <MotionCard
      variants={motions}
      custom={direction}
      initial="init"
      animate="animate"
      exit="exit"
      key="card-step-integrations"
      transition={transition}
      className="w-full"
    >
      <CardHeader>
        <CardTitle>Extra Settings</CardTitle>
        <CardDescription>
          A few extra settings that won&apos;t affect much of the initial
          experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className={"w-full h-fit"}>
          <div className="flex flex-col gap-2 pr-4 w-full">
            <FieldGroup>
              <Controller
                name="useAnalytics"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>
                        Allow Analytics
                      </FieldLabel>
                      <Switch
                        ref={field.ref}
                        id={field.name}
                        name={field.name}
                        disabled={field.disabled}
                        checked={field.value}
                        aria-invalid={fieldState.invalid}
                        onCheckedChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    </FieldContent>
                    <FieldDescription>
                      {appConfigStoreSchema.shape.useAnalytics.description}
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="sendAnalytics"
                control={form.control}
                disabled={!form.watch("useAnalytics")}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>
                        Send Usage Data
                      </FieldLabel>
                      <Switch
                        ref={field.ref}
                        id={field.name}
                        name={field.name}
                        disabled={field.disabled}
                        checked={field.value}
                        aria-invalid={fieldState.invalid}
                        onCheckedChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    </FieldContent>
                    <FieldDescription>
                      {appConfigStoreSchema.shape.sendAnalytics.description}
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="useDiscordRichPresence"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>
                        Use Discord Rich Presence
                      </FieldLabel>
                      <Switch
                        ref={field.ref}
                        id={field.name}
                        name={field.name}
                        disabled={field.disabled}
                        checked={field.value}
                        aria-invalid={fieldState.invalid}
                        onCheckedChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    </FieldContent>
                    <FieldDescription>
                      {
                        appConfigStoreSchema.shape.useDiscordRichPresence
                          .description
                      }
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="useForzaTelemetry"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>
                        Use Forza Telemetry
                      </FieldLabel>
                      <Switch
                        ref={field.ref}
                        id={field.name}
                        name={field.name}
                        disabled={field.disabled}
                        checked={field.value}
                        aria-invalid={fieldState.invalid}
                        onCheckedChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    </FieldContent>
                    <FieldDescription>
                      {appConfigStoreSchema.shape.useForzaTelemetry.description}
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onPrevious}
          variant={"secondary"}
          iconStart={<IconChevronLeft />}
          className={"flex-1"}
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          variant={"default"}
          iconEnd={<IconChevronRight />}
          className={"flex-1"}
        >
          Review
        </Button>
      </CardFooter>
    </MotionCard>
  );
}
