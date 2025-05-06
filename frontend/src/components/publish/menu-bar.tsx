import { AppLogo } from "@/components/app/logo";
import { Button } from "@/components/ui/button";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { useRoot } from "@/lib/hooks/use-router";

const menu = [
  { label: "Beranda", href: "/publish.esensi/dashboard" },
  { label: "Buat Buku", href: "/publish.esensi/create-book" },
  { label: "Onboarding", href: "/publish.esensi/onboarding" },
];

export const PublishMenuBar = () => {
  const { currentPath } = useRoot();
  const local = useLocal({}, async () => {});

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
              key={item.href}
              variant={currentPath === item.href ? "default" : "ghost"}
              className="font-medium"
              onClick={() => navigate(item.href)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};
