import type { FC, ReactNode } from "react";
import { PageHeader } from "./page-header";
import { PageFooter } from "./page-footer";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./sidebar";
import { MobileNavbar } from "./mobile-navbar";

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
    <div className="flex flex-1 flex-col gap-0 pb-25 lg:p-0 m-0 text-[color:#020817]">
      <PageHeader
        title={title}
        back={showBack}
        logo={showLogo}
        search={showSearch}
      />
      <div className="flex-1 lg:py-10">{children}</div>
      <PageFooter />
      <MobileNavbar />
    </div>
  );
};
