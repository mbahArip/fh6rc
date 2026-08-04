import { useIsMobile } from "~/hooks/use-is-mobile";
import { DesktopLayout } from "./DesktopLayout";
import { MobileLayout } from "./MobileLayout";

export function Layout({ children }: React.PropsWithChildren) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLayout>{children}</MobileLayout>;
  }

  return <DesktopLayout>{children}</DesktopLayout>;
}
