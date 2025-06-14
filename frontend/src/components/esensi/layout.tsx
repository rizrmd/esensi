import type { FC, ReactNode } from "react";
import { PageHeader } from "./page-header";
import { PageFooter } from "./page-footer";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./sidebar";
import { MobileNavbar } from "./mobile-navbar";
import { useLocal } from "@/lib/hooks/use-local";

type MainEsensiLayoutProps = {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  showSearch?: boolean;
  header_config?: any;
  mobile_menu?: boolean;
  footer?: boolean;
};

export const MainEsensiLayout: FC<MainEsensiLayoutProps> = ({
  children,
  header_config = {
    enable: true,
    logo: true,
    back: true,
    search: true,
    searchQuery: "",
    title: null,
    cart: true,
    profile: true,
  },
  mobile_menu = true,
  footer = true,
}) => {
  const local = useLocal({ searchQuery: "" }, async () => {});
  return (
    <div className="flex flex-1 flex-col gap-0 pb-25 lg:p-0 m-0 text-[color:#020817]">
      <PageHeader
        enable={header_config.enable}
        title={header_config.title}
        back={header_config.back}
        logo={header_config.logo}
        search={header_config.search}
        searchQuery={header_config.searchQuery}
        cart={header_config.cart}
        profile={header_config.profile}
      />
      <div className="flex-1 lg:py-10">{children}</div>
      <PageFooter />
      <MobileNavbar enable={mobile_menu} />
    </div>
  );
};
