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
  footer_config?: any;
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
    mobileHide: false,
    desktopHide: false,
  },
  mobile_menu = true,
  footer_config={
    desktopHide: false,
  },
}) => {
  const local = useLocal({ searchQuery: "" }, async () => {});
  return (
    <div className="flex h-auto flex-col gap-0 pb-25 lg:pb-0 m-0 text-[color:#020817]">
      <PageHeader
        enable={header_config.enable}
        title={header_config.title}
        back={header_config.back}
        logo={header_config.logo}
        search={header_config.search}
        searchQuery={header_config.searchQuery}
        cart={header_config.cart}
        profile={header_config.profile}
        mobileHide={header_config.mobileHide}
        desktopHide={header_config.desktopHide}
        
      />
      <div className="grow-1 h-auto">{children}</div>
      <PageFooter desktopHide={footer_config.desktopHide} />
      <MobileNavbar enable={mobile_menu} />
    </div>
  );
};
