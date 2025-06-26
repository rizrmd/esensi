import { MainEsensiLayout } from "@/components/esensi/layout";
import { ProfileButton } from "@/components/esensi/profile-button";
import { ProfileLinks } from "@/components/esensi/profile-links";
import { ProfileNavigation } from "@/components/esensi/profile-navigation";
import type { api } from "@/lib/gen/main.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { getDomainKeyByPort } from "@/lib/router";
import {
  BadgeInfo,
  CircleUser,
  DoorOpen,
  FileText,
  LibraryBig,
  MessageCircleMore,
  Search,
  ShoppingBag,
} from "lucide-react";

export default (data: Awaited<ReturnType<typeof api.profile>>["data"]) => {
  const header_config = {
    enable: true,
    logo: false,
    back: true,
    search: false,
    title: "Profile",
    cart: true,
    profile: false,
  };

  const local = {
    loading: true as boolean,
    user: null as any | null,
    royality: null as any | null,
  };
  
  if (data?.user) {
    local.user = data.user;
  }
  if (data?.loyality) {
    local.royality = data.loyality;
  }
  local.loading = false;

  return (
    <MainEsensiLayout header_config={header_config} mobile_menu={true}>
      <div className="flex justify-center p-6 lg:bg-[#E1E5EF] lg:py-10 lg:px-0">
        <div className="flex flex-col w-full h-full max-w-[1200px] h-auto">
          <div className="flex flex-col gap-4 w-full h-auto lg:w-[350px] lg:bg-white lg:py-6 lg:px-8">
            <ProfileNavigation
              user={local.user}
              loyality={local.royality}
              loading={local.loading}
            />
          </div>
        </div>
      </div>
    </MainEsensiLayout>
  );
};
