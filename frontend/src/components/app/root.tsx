import { GlobalAlert } from "@/components/ui/global-alert";
import { useRoot } from "@/lib/hooks/use-router";
import { ParamsContext } from "@/lib/router";
import { Toaster } from "../ui/sonner";
import { AppLoading } from "./loading";
import { AppLayout } from "./layout";

function AppRoot() {
  const { Page, currentPath, isLoading, params } = useRoot();

  if (isLoading) {
    return <AppLoading />;
  }

  // Check if the path is auth related (either starts with /auth or /auth.esensi)
  const isAuthPath =
    currentPath.startsWith("/auth") || currentPath.startsWith("/auth.esensi");

  // For localhost:7500, detect by port and assume it's an auth domain
  const isAuthDomain =
    window.location.hostname === "localhost" && window.location.port === "7500";

  const init_data = (window as any).__data || {};

  if (isAuthPath || isAuthDomain) {
    return (
      <>
        {Page ? (
          <ParamsContext.Provider value={params}>
            <AppLayout>
              {Page ? <Page {...init_data} /> : <div>Page not found</div>}
            </AppLayout>
          </ParamsContext.Provider>
        ) : (
          <div>Page not found</div>
        )}
      </>
    );
  }

  return (
    <ParamsContext.Provider value={params}>
      <AppLayout>
        {Page ? <Page {...init_data} /> : <div>Page not found</div>}
      </AppLayout>
    </ParamsContext.Provider>
  );
}

export function Root() {
  return (
    <>
      <GlobalAlert />
      <Toaster />
      <AppRoot />
    </>
  );
}
