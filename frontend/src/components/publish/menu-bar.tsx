import { AppLogo } from "@/components/app/logo";
import { Button } from "@/components/ui/button";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { useRoot } from "@/lib/hooks/use-router";
import { betterAuth } from "@/lib/better-auth";

const menu = [
  { label: "Beranda", href: "/dashboard" },
  { label: "Buat Buku", href: "/create-book" },
  { label: "Keluar", action: "signout" },
];

export const PublishMenuBar = ({ title }: { title: string }) => {
  const { currentPath } = useRoot();
  const local = useLocal({}, async () => {});

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
        <div className="flex gap-2">
          {menu
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
