import { Link } from "@/lib/router";
import {
  CircleEllipsis,
  CircleUserRound,
  House,
  LibraryBig,
  ShoppingBasket,
} from "lucide-react";

export const PageFooter = () => {
  const menus = [
    {
      label: "Home",
      url: "/store",
      icon: <House size={20} strokeWidth={1.5} />,
    },
    {
      label: "My Library",
      url: "/download/_",
      icon: <LibraryBig size={20} strokeWidth={1.5} />,
    },
    {
      label: "Cart",
      url: "/cart",
      icon: <ShoppingBasket size={20} strokeWidth={1.5} />,
    },
    {
      label: "Esensi",
      url: "/esensi",
      icon: <CircleEllipsis size={20} strokeWidth={1.5} />,
    },
    {
      label: "Profile",
      url: "/profile",
      icon: <CircleUserRound size={20} strokeWidth={1.5} />,
    },
  ];

  let menuButtons = menus.map((btn, i) => {
    return (
      <Link
        key={`footernav_${i}`}
        href={btn.url}
        className="flex flex-col gap-1 justify-center items-center h-full text-[color:#b0b0b1]"
      >
        {btn.icon}
        <span
          key={`footernav_label_${i}`}
          className="text-[size:10px] text-[color:#444]"
        >
          {btn.label}
        </span>
      </Link>
    );
  });
  return (
    <div className="flex flex-row justify-around items-center w-full pt-2 pb-2 h-[60px] border-t-2 border-t-[color:#D3d3d3]">
      {menuButtons}
    </div>
  );
};
