import {
  Button,
  ButtonGroup,
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
  runThemeViewTransition,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ThemeButton,
} from "@fh6rc/ui";
import {
  IconAccessible,
  IconChevronLeft,
  IconChevronRight,
  IconCircleHalf2,
  IconLanguage,
  IconMoon,
  IconMoonFilled,
  IconSun,
  IconSunFilled,
} from "@fh6rc/ui/icons";
import type { Transition, Variants } from "motion";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type z from "zod";
import { appConfigStore, appConfigStoreSchema } from "~/store/appConfig.store";

type Props = {
  motions: Variants;
  transition: Transition;
  direction: number;
  onPrevious: () => void;
  onNext: () => void;
  form: UseFormReturn<z.infer<typeof appConfigStoreSchema>>;
};

const MotionCard = motion.create(Card);
const themeStyleSelector = `app-color-scheme`;

export function UICard({
  motions,
  transition,
  direction,
  onPrevious,
  onNext,
  form,
}: Props) {
  const { setTheme, resolvedTheme } = useTheme();
  const onColorDOMChange = React.useCallback(
    (accents: keyof typeof appConfigStore.accents) => {
      let existingStyle = document.querySelector<HTMLStyleElement>(
        `#${themeStyleSelector}`,
      );
      if (existingStyle) {
        existingStyle.innerHTML = ``;
      } else {
        existingStyle = document.createElement("style");
        existingStyle.id = themeStyleSelector;
        document.head.appendChild(existingStyle);
      }

      const data = appConfigStore.accents[accents];
      existingStyle.innerHTML = `:root{--primary:${data.background.light} !important;--primary-foreground:${data.foreground.light} !important}.dark{--primary:${data.background.dark} !important;--primary-foreground:${data.foreground.dark} !important}`;
    },
    [],
  );
  const onResetDOMChange = React.useCallback(() => {
    const existingStyle = document.querySelector<HTMLStyleElement>(
      `#${themeStyleSelector}`,
    );
    if (existingStyle) existingStyle.innerHTML = ``;
  }, []);
  const onReduceMotionChange = React.useCallback((value: boolean) => {
    if (value) {
      document.documentElement.setAttribute("data-reduce-motion", "true");
    } else {
      document.documentElement.removeAttribute("data-reduce-motion");
    }
  }, []);
  const onResetReduceMotionChange = React.useCallback(() => {
    document.documentElement.removeAttribute("data-reduce-motion");
  }, []);

  return (
    <MotionCard
      variants={motions}
      custom={direction}
      initial="init"
      animate="animate"
      exit="exit"
      key="card-step-ui"
      transition={transition}
      className="w-full"
    >
      <CardHeader>
        <CardTitle>App Settings</CardTitle>
        <CardDescription>
          Configure how the app behaves and looks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className={"w-full h-fit"}>
          <div className="flex flex-col gap-2 pr-4 w-full ">
            <FieldGroup>
              <Controller
                name="theme"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>App Theme</FieldLabel>
                      <ButtonGroup
                        ref={field.ref}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        onBlur={(e) => {
                          if (!e.currentTarget.contains(e.relatedTarget)) {
                            field.onBlur();
                          }
                        }}
                        className="flex-1 max-w-52"
                      >
                        <ThemeButton
                          iconStart={
                            field.value === "light" ? (
                              <IconSunFilled />
                            ) : (
                              <IconSun />
                            )
                          }
                          variant={
                            field.value === "light" ? "default" : "secondary"
                          }
                          className={"flex-1"}
                          theme="light"
                          onThemeChange={() => {
                            field.onChange("light");
                            setTheme("light");
                          }}
                        >
                          Light
                        </ThemeButton>
                        <ThemeButton
                          iconStart={
                            field.value === "dark" ? (
                              <IconMoonFilled />
                            ) : (
                              <IconMoon />
                            )
                          }
                          variant={
                            field.value === "dark" ? "default" : "secondary"
                          }
                          className={"flex-1"}
                          theme="dark"
                          onThemeChange={() => {
                            field.onChange("dark");
                            setTheme("dark");
                          }}
                        >
                          Dark
                        </ThemeButton>
                      </ButtonGroup>
                    </FieldContent>
                    <FieldDescription>
                      {appConfigStoreSchema.shape.theme.description}
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="accent"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel>Accent Color</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          runThemeViewTransition({
                            fromCenter: true,
                            action: () => {
                              field.onChange(value);
                              onColorDOMChange(value ?? "orange");
                            },
                          });
                        }}
                      >
                        <SelectTrigger
                          ref={field.ref}
                          id={field.name}
                          name={field.name}
                          disabled={field.disabled}
                          onBlur={field.onBlur}
                          aria-invalid={fieldState.invalid}
                          className={"flex-1 max-w-52"}
                        >
                          <SelectValue
                            render={(props) => (
                              <div
                                className="flex items-center gap-2"
                                {...props}
                              >
                                <IconCircleHalf2
                                  className="rotate-45"
                                  style={{
                                    fill: appConfigStore.accents[
                                      props.children as keyof typeof appConfigStore.accents
                                    ].background[
                                      (resolvedTheme ?? "dark") as
                                        | "light"
                                        | "dark"
                                    ],
                                    color:
                                      appConfigStore.accents[
                                        props.children as keyof typeof appConfigStore.accents
                                      ].foreground[
                                        (resolvedTheme ?? "dark") as
                                          | "light"
                                          | "dark"
                                      ],
                                  }}
                                />
                                <span className="capitalize">
                                  {props.children?.toString()}
                                </span>
                              </div>
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {appConfigStoreSchema.shape.accent
                            .unwrap()
                            .options.map((accent) => (
                              <SelectItem
                                key={`accent-${accent}`}
                                value={accent}
                              >
                                <IconCircleHalf2
                                  className="rotate-45"
                                  style={{
                                    fill: appConfigStore.accents[accent]
                                      .background[
                                      (resolvedTheme ?? "dark") as
                                        | "light"
                                        | "dark"
                                    ],
                                    color:
                                      appConfigStore.accents[accent].foreground[
                                        (resolvedTheme ?? "dark") as
                                          | "light"
                                          | "dark"
                                      ],
                                  }}
                                />
                                <span className="capitalize">{accent}</span>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FieldContent>
                    <FieldDescription>
                      {appConfigStoreSchema.shape.accent.description}
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="languages"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    {/* TODO: implement i18n */}
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>Languages</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          ref={field.ref}
                          id={field.name}
                          name={field.name}
                          disabled={field.disabled}
                          onBlur={field.onBlur}
                          aria-invalid={fieldState.invalid}
                          className={"flex-1 max-w-52"}
                        >
                          <SelectValue
                            render={(props) => (
                              <div className="flex items-center gap-2">
                                <IconLanguage />
                                {props.children === "en"
                                  ? "English"
                                  : "Bahasa Indonesia"}
                              </div>
                            )}
                            placeholder={
                              <div className="flex items-center gap-2">
                                <IconLanguage />
                                Pick your desired languages
                              </div>
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {appConfigStoreSchema.shape.languages
                            .unwrap()
                            .options.map((v) => (
                              <SelectItem key={v} value={v}>
                                <IconLanguage />
                                {v === "en" ? "English" : "Indonesian"}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FieldContent>
                    <FieldDescription>
                      {appConfigStoreSchema.shape.languages.description}
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="motionSafe"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>
                        Reduce Motion
                      </FieldLabel>
                      <Select
                        value={String(field.value)}
                        onValueChange={(v) => {
                          const value = String(v);
                          field.onChange(value === "true");
                          onReduceMotionChange(value === "true");
                        }}
                      >
                        <SelectTrigger
                          ref={field.ref}
                          id={field.name}
                          name={field.name}
                          disabled={field.disabled}
                          onBlur={field.onBlur}
                          aria-invalid={fieldState.invalid}
                          className="max-w-52 flex-1"
                        >
                          <SelectValue
                            render={(props) => (
                              <div className="flex items-center gap-2">
                                <IconAccessible />
                                {String(props.children) === "true"
                                  ? "Enabled"
                                  : "Disabled"}
                              </div>
                            )}
                            placeholder={
                              <div className="flex items-center gap-2">
                                <IconAccessible />
                                {field.value ? "Enabled" : "Disabled"}
                              </div>
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem key="true" value="true">
                            <IconAccessible />
                            Enabled
                          </SelectItem>
                          <SelectItem key="false" value="false">
                            <IconAccessible />
                            Disabled
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldContent>
                    <FieldDescription>
                      {appConfigStoreSchema.shape.motionSafe.description}
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
          className={"flex-1"}
          onClick={(e) => {
            if (form.getFieldState("motionSafe").isDirty) {
              onResetReduceMotionChange();
              form.resetField("motionSafe");
            }
            if (
              form.getFieldState("accent").isDirty ||
              form.getFieldState("theme").isDirty
            ) {
              runThemeViewTransition({
                trigger: e,
                fromCenter: true,
                action: () => {
                  onPrevious();
                  form.resetField("theme");
                  setTheme(form.getValues("theme"));
                  form.resetField("accent");
                  onResetDOMChange();
                },
              });
            } else {
              onPrevious();
            }
          }}
          variant={"secondary"}
          iconStart={<IconChevronLeft />}
        >
          Back
        </Button>
        <Button
          className={"flex-1"}
          onClick={onNext}
          variant={"default"}
          iconEnd={<IconChevronRight />}
        >
          Next
        </Button>
      </CardFooter>
    </MotionCard>
  );
}
