import type { FC, ReactNode } from "react";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./header";

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      {false && <AppSidebar />}
      <main className="flex-1 flex flex-col">
        <AppHeader />
        {children}
      </main>
    </SidebarProvider>
  );
};
