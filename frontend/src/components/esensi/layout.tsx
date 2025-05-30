import type { FC, ReactNode } from "react";
import { PageHeader } from "./page-header";
import { PageFooter } from "./page-footer";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./sidebar";

type MainEsensiLayoutProps = {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  showSearch?: boolean;
};

export const MainEsensiLayout: FC<MainEsensiLayoutProps> = ({
  children,
  title = "Esensi Online",
  showBack = true,
  showLogo = true,
  showSearch = true,
}) => {
  return (
    <div className="flex flex-1 flex-col gap-0 w-screen h-screen fixed p-0 m-0 overflow-hidden text-[color:#020817]">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-0 max-w-screen md:max-w-[calc(100%-var(\-\-sidebar\-width))]">
          <PageHeader 
            title={title}
            back={showBack}
            logo={showLogo}
            search={showSearch}
          />
          <div className="flex-1 min-h-0 overflow-y-auto lg:py-10">
            {children}
          </div>
          <PageFooter />
        </div>
      </SidebarProvider>
    </div>
  );
};