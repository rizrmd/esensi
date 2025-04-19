import type { FC, ReactNode } from "react";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./header";

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const loggedIn = false;
  return (
    <SidebarProvider>
      {loggedIn && <AppSidebar />}
      <main className="flex-1 flex flex-col">
        {loggedIn && <AppHeader />}
        {children}
      </main>
    </SidebarProvider>
  );
};
