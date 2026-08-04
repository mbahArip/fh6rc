import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
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
  DialogClose,
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
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  ScrollArea,
  toast,
} from "@fh6rc/ui";
import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconPlug,
  IconServer,
  IconWifi,
} from "@fh6rc/ui/icons";
import type { Transition, Variants } from "motion";
import { motion } from "motion/react";
import * as React from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type z from "zod";
import { useIsMobile } from "~/hooks/use-is-mobile";
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

export function ServerCard({
  motions,
  transition,
  direction,
  onPrevious,
  onNext,
  form,
}: Props) {
  const isMobile = useIsMobile();
  const FindIPTrigger = React.useMemo(
    () => (
      <Button
        variant={"link"}
        size={"sm"}
        className={"rounded-none px-0 py-0 inline-flex"}
        hideIcon
      >
        Need help finding your host IP?
      </Button>
    ),
    [],
  );
  const FindIPHeader = React.useMemo(
    () => ({
      title: "How to find your IP address",
      description: "Short guide to find your host IP address",
    }),
    [],
  );
  const FindIPClose = React.useMemo(
    () => (
      <Button
        variant={"outline"}
        className={"w-full"}
        iconStart={<IconCheck />}
      >
        Understood
      </Button>
    ),
    [],
  );
  const FindIPContent = React.useMemo(
    () => (
      <Accordion className={"border-0 rounded-none"}>
        <AccordionItem
          className={"data-open:bg-transparent border-blast:border-b-0"}
          value={"same-device"}
        >
          <AccordionTrigger className={"px-6"}>
            I&apos;m playing on the same device
          </AccordionTrigger>
          <AccordionContent className={"px-4"}>
            <p>
              <b>You don&apos;t need to change anything!</b>
              <br />
              By default, it&apos;s already set to automatically detect the mod
              server on your local network.
            </p>
          </AccordionContent>
          <AccordionItem
            className={"data-open:bg-transparent border-blast:border-b-0"}
            value={"different-device"}
          >
            <AccordionTrigger className={"px-6"}>
              I&apos;m using this app on another device
            </AccordionTrigger>
            <ScrollArea className={"w-full h-fit"}>
              <div className="w-full max-h-[45dvh]">
                <AccordionContent className={"space-y-4 px-4"}>
                  <p>
                    You&apos;ll need the local IP address of the device running
                    Forza Horizon 6. Here&apos;s how to find it on Windows:
                  </p>

                  <ol className="list-decimal pl-4 space-y-2">
                    <li>
                      <p>
                        Open Command Prompt or PowerShell (press <kbd>Win</kbd>{" "}
                        + <kbd>R</kbd>, type <kbd>cmd</kbd>, and press{" "}
                        <kbd>Enter</kbd>).
                      </p>
                    </li>
                    <li>
                      <p>
                        Type <kbd>ipconfig</kbd> and press <kbd>Enter</kbd>.
                      </p>
                    </li>
                    <li>
                      <p>
                        Locate your active connection (Ethernet or Wi-Fi) and
                        find the <code>IPv4 Address</code>.
                      </p>
                    </li>
                    <li>
                      <p>
                        Copy the IP address (e.g., <code>192.168.1.100</code>).
                      </p>
                    </li>
                    <li>
                      <p>
                        Enter the IP address into the <strong>Host</strong>{" "}
                        field above.
                      </p>
                    </li>
                  </ol>

                  <Alert>
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      Both devices must be connected to the same local network.
                      <br />
                      <br />
                      <strong>Advance User</strong> can use virtual network
                      tools like Tailscale and enter your main PC&apos;s
                      Tailscale IP address.
                    </AlertDescription>
                  </Alert>
                </AccordionContent>
              </div>
            </ScrollArea>
          </AccordionItem>
        </AccordionItem>
      </Accordion>
    ),
    [],
  );

  const [testPending, startTest] = React.useTransition();
  const onTestConnection = React.useCallback(() => {
    startTest(async () => {
      try {
        const data = form.getValues();
        const endpoint = new URL("/api/state", `${data.host}:${data.port}`);
        const res = await fetch(endpoint, {
          method: "GET",
          cache: "no-cache",
        }).catch(() => {
          throw new Error(
            "Make sure the host and port are correct, and Forza Horizon 6 is running with the mod.",
          );
        });
        if (!res.ok)
          throw new Error(
            "Make sure the host and port are correct, and Forza Horizon 6 is running with the mod.",
          );
        toast.success("Connected!", {
          description: `You can go ahead and continue to the next step.`,
          id: "test-connection",
        });
      } catch (error) {
        toast.error("Failed to connect", {
          description: (error as Error).message,
          id: "test-connection",
        });
      }
    });
  }, [form]);

  return (
    <MotionCard
      variants={motions}
      custom={direction}
      initial="init"
      animate="animate"
      exit="exit"
      key="card-step-server"
      transition={transition}
      className="w-full"
    >
      <CardHeader>
        <CardTitle>Server Settings</CardTitle>
        <CardDescription>Link the app to active host</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className={"w-full h-fit"}>
          <div className="flex flex-col gap-2 pr-4 w-full h-full">
            <FieldGroup>
              <Controller
                name="host"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>Host</FieldLabel>

                      <InputGroup className="flex-1 max-w-52">
                        <InputGroupAddon>
                          <IconServer />
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder={
                            appConfigStoreSchema.shape.host.def.defaultValue
                          }
                        />
                      </InputGroup>
                    </FieldContent>
                    <FieldDescription>
                      {appConfigStoreSchema.shape.host.description}

                      {isMobile ? (
                        <Drawer>
                          <DrawerTrigger render={FindIPTrigger} />
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>{FindIPHeader.title}</DrawerTitle>
                              <DrawerDescription>
                                {FindIPHeader.description}
                              </DrawerDescription>
                            </DrawerHeader>
                            <div className="px-4">{FindIPTrigger}</div>
                            <DrawerFooter>
                              <DrawerClose
                                className={"w-full"}
                                render={FindIPClose}
                              />
                            </DrawerFooter>
                          </DrawerContent>
                        </Drawer>
                      ) : (
                        <Dialog>
                          <DialogTrigger render={FindIPTrigger} />
                          <DialogContent className={"px-0"}>
                            <DialogHeader className="px-6">
                              <DialogTitle>{FindIPHeader.title}</DialogTitle>
                              <DialogDescription>
                                {FindIPHeader.description}
                              </DialogDescription>
                            </DialogHeader>

                            {FindIPContent}

                            <DialogFooter className="px-6">
                              <DialogClose
                                className={"w-full"}
                                render={FindIPClose}
                              />
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="port"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>Port</FieldLabel>
                      <InputGroup className="flex-1 max-w-52">
                        <InputGroupAddon>
                          <IconPlug />
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder={`${appConfigStoreSchema.shape.port.def.defaultValue}`}
                        />
                      </InputGroup>
                    </FieldContent>
                    <FieldDescription>
                      {appConfigStoreSchema.shape.port.description}
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
        <div className="flex-1 flex items-center justify-start">
          <Button
            variant={"outline"}
            onClick={onTestConnection}
            iconStart={<IconWifi />}
            isLoading={testPending}
          >
            Test Connection
          </Button>
        </div>
        <Button
          onClick={onPrevious}
          variant={"secondary"}
          iconStart={<IconChevronLeft />}
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          variant={"default"}
          iconEnd={<IconChevronRight />}
          disabled={
            !!form.formState.errors.host ||
            !!form.formState.errors.port
          }
        >
          Next
        </Button>
      </CardFooter>
    </MotionCard>
  );
}
