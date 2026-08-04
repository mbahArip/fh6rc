import { Toaster, TooltipProvider } from "@fh6rc/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Outlet } from "react-router";
import { AppConfigProvider } from "~/provider/AppConfigProvider";
import { GameStateProvider } from "~/provider/GameStateProvider";
import { IsMobileProvider } from "~/provider/IsMobileProvider";
import { Layout } from "./Layout";

const queryClient = new QueryClient();

export default function AppProvider() {
  return (
    <ThemeProvider
      attribute={"class"}
      defaultTheme="dark"
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <IsMobileProvider>
          <TooltipProvider>
            <Layout>
              <AppConfigProvider>
                <GameStateProvider>
                  <Outlet />
                </GameStateProvider>
              </AppConfigProvider>

              <Toaster richColors position="bottom-right" />
            </Layout>
          </TooltipProvider>
        </IsMobileProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
