import { Link } from "@/lib/router";
import { ChevronDown } from "lucide-react";

export const DesktopMenu = ({ data = [] as any, parent = null as any }) => {
  const build = (menu = [] as any, parent = null as any) => {
    const the_list = menu.map((item, idx) => {
      const the_submenu =
        item?.submenu && item?.submenu !== null ? (
          build(item.submenu, idx)
        ) : (
          <></>
        );
      const the_chevron =
        item?.submenu && item?.submenu !== null ? (
          <ChevronDown size={14} />
        ) : (
          <></>
        );
      return (
        <li
          className={`flex relative ${
            parent !== null ? "h-7 w-full hover:bg-[#ccc]" : "h-full"
          }`}
          key={`esensi_dmenu_${parent !== null ? `${parent}_` : ""}_${idx}`}
        >
          <Link
            href={item?.url}
            target={item?.newtab ? "_blank" : "_self"}
            className={`flex h-full gap-1.5 items-center ${
              parent !== null
                ? "px-4 w-full justify-between [&_svg]:rotate-[-90deg] [&_svg]:-mr-3"
                : ""
            }`}
          >
            {item?.label} {the_chevron}
          </Link>
          {the_submenu}
        </li>
      );
    });

    const the_wrapper = (
      <ul
        className={`${
          parent == null
            ? "flex h-10 gap-4 [&_li_ul]:hidden [&_li:hover>ul]:flex"
            : "flex-col absolute min-w-[160px] text-[14px] left-0 py-2 bg-white -ml-4 shadow-lg rounded-sm [&_ul]:left-full [&_ul]:ml-0 [&_ul]:-mt-2"
        } shrink-0 `}
      >
        {the_list}
      </ul>
    );
    return the_wrapper;
  };
  const list = build(data);

  const renderMenu = data.length > 0 && <>{list}</>;
  return (
    <div className="hidden px-3 lg:flex shrink-0 [&_ul_ul]:top-full [&_ul_ul_ul]:top-0">
      {renderMenu}
    </div>
  );
};
