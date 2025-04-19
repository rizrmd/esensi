import { GalleryVerticalEnd } from "lucide-react";
import type { FC } from "react";

export const AppLogo: FC<{ text?: boolean; small?: boolean }> = ({
  text,
  small,
}) => {
  if (small) {
    return (
      <a href="#" className="flex items-center gap-[6px] font-medium text-xs">
        <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-primary text-primary-foreground">
          <img src="/img/logo.webp" />
        </div>

        {text !== false && (
          <div className="text-[#58b5e0]">
            <span className="text-[#016bb3]">Esensi</span> Online
          </div>
        )}
      </a>
    );
  }
  return (
    <a href="#" className="flex items-center gap-2 font-medium">
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <img src="/img/logo.webp" />
      </div>
      {text !== false && (
        <div className="text-[#58b5e0]">
          <span className="text-[#016bb3]">Esensi</span> Online
        </div>
      )}
    </a>
  );
};
