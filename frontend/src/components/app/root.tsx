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

  if (currentPath.startsWith("/auth")) {
    return (
      <>
        {Page ? (
          <ParamsContext.Provider value={params}>
            {<Page />}
          </ParamsContext.Provider>
        ) : (
          <div>Page not found</div>
        )}
      </>
    );
  }

  return (
    <ParamsContext.Provider value={params}>
      <AppLayout>{Page ? <Page /> : <div>Page not found</div>}</AppLayout>
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
