import type { FC, ReactNode } from "react";
import { PageHeader } from "./page-header";
import { PageFooter } from "./page-footer";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./sidebar";
import { MobileNavbar } from "./mobile-navbar";
import { useLocal } from "@/lib/hooks/use-local";
import { ProfileNavigation } from "./profile-navigation";
import { ProfileSlide } from "./profile-slide";

type MainEsensiLayoutProps = {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  showSearch?: boolean;
  header_config?: any;
  mobile_menu?: boolean;
  footer_config?: any;
  profile?: any;
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
  footer_config = {
    desktopHide: false,
  },
  profile = {
    user: {
      avatar: null as string | null,
      fullname: "John Doe" as string,
      email: "johndoe@esensi.online" as string | null,
    },
    loyality: {
      id: "JOHNDOE" as string | null,
      points: 0 as number,
    },
  },
}) => {
  const local = useLocal(
    { searchQuery: "", profileOpen: false as boolean },
    async () => {}
  );
  const toggleProfile = () => {
    local.profileOpen = !local.profileOpen;
    local.render();
  };
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
        toggleProfile={toggleProfile}
      />
      <div className="grow-1 h-auto">{children}</div>
      <PageFooter desktopHide={footer_config.desktopHide} />
      <MobileNavbar enable={mobile_menu} />
      <ProfileSlide open={local.profileOpen} profile={profile}  action={toggleProfile} />
    </div>
  );
};
