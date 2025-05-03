import { AppLogo } from "./logo";
import { Button } from "../ui/button";

export const AppHeader = () => {
  return (
    <header className="flex h-16 items-center gap-4 border-b px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <AppLogo />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost">Masuk</Button>
        <Button>Daftar</Button>
      </div>
    </header>
  );
};
