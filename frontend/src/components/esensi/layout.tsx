import { baseUrl } from "@/lib/gen/base-url";
import { useLocal } from "@/lib/hooks/use-local";
import type { FC, ReactNode } from "react";
import { current, Protected } from "../app/protected";
import { PublishFallback } from "../ext/publish-fallback";
import { MobileNavbar } from "./mobile-navbar";
import { PageFooter } from "./page-footer";
import { PageHeader } from "./page-header";
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
  menu_categories?: any;
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
  menu_categories = [],
  mobile_menu = true,
  footer_config = {
    desktopHide: false,
  },
}) => {
  const local = useLocal(
    {
      searchQuery: "",
      profileOpen: false as boolean,
    },
    async () => {
      // Force a re-render when current user changes
      local.render();
    }
  );



  const toggleProfile = () => {
    local.profileOpen = !local.profileOpen;
    local.render();
  };

  // Helper function to construct proper avatar URL
  const getAvatarUrl = (imageFilename: string | null | undefined) => {
    if (!imageFilename) return null;

    // If it's already a full URL, return as is
    if (imageFilename.startsWith("http")) return imageFilename;

    // If it starts with slash, it's a relative path from auth_esensi domain
    if (imageFilename.startsWith("/")) {
      return `${baseUrl.auth_esensi}${imageFilename}`;
    }

    // Otherwise, it's a filename that needs to be served through the files endpoint
    return `${baseUrl.auth_esensi}/${imageFilename}`;
  };

  // Helper function to generate loyalty data
  const getLoyaltyData = () => {
    if (!current.user?.customer) return null;

    // Generate loyalty ID from user info or use existing customer data
    const loyaltyId = current.user.customer.id
      ? current.user.customer.id.slice(-8).toUpperCase()
      : "GUEST";

    // For now, return mock points data - in real app, this would come from the customer record
    return {
      id: loyaltyId,
      points: 0, // This should come from the actual customer loyalty data
    };
  };

  // Prepare user profile data from the logged-in user
  const userProfile = current.user
    ? {
        user: {
          avatar: getAvatarUrl(current.user.image),
          fullname: current.user.name || "Pengguna",
          email: current.user.email || null,
        },
        loyality: getLoyaltyData() || {
          id: null,
          points: 0,
        },
      }
    : null; // Pass null to show guest login state
  return (
    <Protected role={"any"} fallback={PublishFallback} disableRedirect={true}>
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
          menu_categories={menu_categories}
        />
        <div className="grow-1 h-auto">{children}</div>
        <PageFooter desktopHide={footer_config.desktopHide} />
        <MobileNavbar enable={mobile_menu} />
        <ProfileSlide
          open={local.profileOpen}
          profile={userProfile}
          loading={false}
          action={toggleProfile}
        />
      </div>
    </Protected>
  );
};
