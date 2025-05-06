import { AppLogo } from "@/components/app/logo";
import { Button } from "@/components/ui/button";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { useRoot } from "@/lib/hooks/use-router";

const menu = [
  { label: "Beranda", href: "/dashboard" },
  { label: "Buat Buku", href: "/create-book" },
  { label: "Keluar", action: "signout" },
];

export const PublishMenuBar = () => {
  const { currentPath } = useRoot();
  const local = useLocal({}, async () => {});

  const handleMenuClick = (item: typeof menu[number]) => {
    if (item.action === "signout") {
      // TODO: implement sign out logic, e.g. clear session and redirect
      // For now, just redirect to login page
      navigate("/auth/login");
      return;
    }
    if (item.href) {
      navigate(item.href);
    }
  };

  return (
    <nav className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-14 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          <AppLogo className="h-8 w-auto" />
          <span className="font-bold text-lg text-gray-700">Esensi Publish</span>
        </div>
        <div className="flex gap-2">
          {menu.map((item) => (
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
