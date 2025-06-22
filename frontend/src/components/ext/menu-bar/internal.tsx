import { AppLogo } from "@/components/app/logo";
import { NotifDropdown } from "@/components/ext/notification-dropdown";
import { Button } from "@/components/ui/button";
import {
  betterAuth,
  type AuthClientGetSessionAPIResponse,
} from "@/lib/better-auth";
import { useLocal } from "@/lib/hooks/use-local";
import { useRoot } from "@/lib/hooks/use-router";
import { navigate } from "@/lib/router";
import { isAuthor, isInternal, isPublisher } from "@/lib/utils";
import type { User } from "backend/lib/better-auth";
import type { FC } from "react";

const menu = [
  { label: "Beranda", href: "/dashboard" },
  { label: "Buku", href: "/manage-book" },
  { label: "Bundle", href: "/manage-bundle" },
  { label: "Penulis", href: "/manage-author" },
  { label: "Konfigurasi", href: "/manage-cfg" },
  { label: "Profil", href: "/profil" },
  { label: "Keluar", action: "signout" },
];

export const MenuBarInternal: FC<{ title?: string }> = ({ title } = {}) => {
  const { currentPath } = useRoot();
  const local = useLocal(
    {
      menu: [] as typeof menu,
      user: null as User | null,
    },
    async () => {
      const session: AuthClientGetSessionAPIResponse =
        await betterAuth.getSession();
      if (session) {
        const user = session.data?.user;
        local.user = user || null;
        if (!!user && isPublisher(user)) {
          local.menu = menu.filter((x) => x.href !== "/manage-book");
          local.render();
        }
        if (!!user && isAuthor(user)) {
          local.menu = menu.filter((x) => x.href !== "/manage-bundle");
          local.render();
        }
        if (!!user && isInternal(user)) {
          local.menu = menu;
          local.render();
        }
      }
    }
  );

  const handleMenuClick = (item: (typeof menu)[number]) => {
    if (item.action === "signout")
      betterAuth.signOut().finally(() => navigate("/"));
    else if (item.href) navigate(item.href);
  };

  return (
    <nav className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-14 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          <AppLogo className="h-8 w-auto" />
          <span className="font-bold text-lg text-gray-700 text-center">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {local.user && <NotifDropdown user={local.user} />}
          {local.menu
            .filter(
              (item) =>
                currentPath !== "/onboarding" ||
                (currentPath === "/onboarding" && item.action === "signout")
            )
            .map((item) => (
              <Button
                key={item.href || item.action}
                variant={currentPath === item.href ? "default" : "ghost"}
                className="font-medium"
                onClick={() => handleMenuClick(item)}
              >
                {item.label}
              </Button>
            ))}
        </div>
      </div>
    </nav>
  );
};
