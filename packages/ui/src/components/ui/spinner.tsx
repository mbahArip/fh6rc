import { cn } from "@fh6rc/ui/lib/utils";
import { IconLoader2 } from "@tabler/icons-react";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <IconLoader2
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 text-primary animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
