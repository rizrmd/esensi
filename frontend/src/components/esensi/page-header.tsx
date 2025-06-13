import { Button } from "../ui/button";
import { navigate } from "@/lib/router";
import {
  ArrowLeft,
  ChevronLeft,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import { Input } from "../ui/input";
import { useLocal } from "@/lib/hooks/use-local";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type MenuItem = {
  label: string;
  url: string;
  newtab: boolean;
  submenu: MenuItem[] | null;
};

const menuItems: MenuItem[] = [
  {
    label: "Beranda",
    url: "/",
    newtab: false,
    submenu: null,
  },
  {
    label: "Kategori",
    url: "",
    newtab: false,
    submenu: null,
  },
  {
    label: "Tentang Kami",
    url: "",
    newtab: false,
    submenu: [
      {
        label: "Tentang Kami",
        url: "",
        newtab: false,
        submenu: null,
      },
      {
        label: "Tentang Kami",
        url: "",
        newtab: false,
        submenu: null,
      },
      {
        label: "Tentang Kami",
        url: "",
        newtab: false,
        submenu: null,
      },
      {
        label: "Tentang Kami",
        url: "",
        newtab: false,
        submenu: null,
      },
    ],
  },
  {
    label: "Hubungi Kami",
    url: "",
    newtab: false,
    submenu: null,
  },
];

export const PageHeader = ({
  enable = true as boolean,
  logo = true as boolean,
  back = true as boolean,
  title = "Esensi Online" as string | null,
  search = true as boolean,
  searchQuery = "" as string,
  cart = true as boolean,
  profile = true as boolean,
}) => {
  const local = useLocal(
    {
      enable: enable,
      logo: logo,
      back: back,
      title: title,
      search: search,
      searchQuery: searchQuery,
      cart: cart,
      profile: profile,
    },
    async () => {
      local.enable = enable;
      local.logo = logo;
      local.back = back;
      local.title = title;
      local.search = search;
      local.searchQuery = searchQuery;
      local.cart = cart;
      local.profile = profile;
      local.render();
    },
  );

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      navigate(`/search/${encodeURIComponent(local.searchQuery)}`);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 px-4 lg:static ${local.enable ? "flex" : "hidden lg:flex"} flex-row justify-center items-center w-full bg-background lg:h-36`}
    >
      <div className="container flex h-14 items-center">
        {/* Back Button */}
        {local.back && (
          <button
            className="flex justify-center items-center aspect-1/1 w-auto h-full lg:hidden mr-2 -ml-4 [&>svg]:stroke-[#3B2C93] cursor-pointer"
            onClick={() => history.back()}
          >
            <ArrowLeft size={25} strokeWidth={1.75} />
          </button>
        )}

        {/* Logo */}
        {local.logo && (
          <img
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOUKb6M5yGcRNhuM1NHSBaAvbNYSFAibMX-1xCI8gI8jl-h566LB-SNs4PW7s2hyphenhyphenj9WNdyhCtn8LFqX9V2j-ABFZoN-nw34q0l4Hf3a13EMffqv6edTQAzK7O-8RXpOIA69rTg6g60hv0eME6yDgJpUZEFIastMfEW-6Pjpq6LFXoGdKExm7L-Hu9PYy8/s1600/esensi-online-logo.png"
            alt="Esensi Online"
            className="h-8 w-auto lg:h-16"
          />
        )}

        {/* Title Bar */}
        {local.title !== null && local.title !== "" && (
          <div className="flex lg:hidden justify-content items-center color-[#3B2C93]">
            {local.title}
          </div>
        )}

        {/* Search Bar */}
        {local.search && (
          <div className="flex-1 mx-4 lg:ml-12 lg:mr-4">
            <div className="relative">
              <Search className="absolute left-2 lg:left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari buku..."
                className="w-full pl-8 lg:pl-10 bg-[#F6F6F6] text-[#000] rounded-full text-sm border-none focus:border-none focus:ring-0"
                value={local.searchQuery}
                onChange={(e) => {
                  local.searchQuery = e.target.value;
                  local.render();
                }}
                onKeyUp={handleSearch}
              />
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <NavigationMenu className="hidden lg:flex ml-4 lg:mx-8">
          <NavigationMenuList>
            {menuItems.map((item, index) => (
              <NavigationMenuItem key={index}>
                {item.submenu ? (
                  <>
                    <NavigationMenuTrigger className="text-black data-[state=open]:text-[#3B2C93] active:text-[#3B2C93] focus:text-[#3B2C93] data-[state=open]:bg-transparent hover:bg-transparent focus:bg-transparent cursor-pointer">
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="py-1 min-w-[16rem]">
                      <ul className="flex flex-col">
                        {item.submenu.map((subItem, subIndex) => (
                          <li
                            key={subIndex}
                            className="cursor-pointer hover:bg-accent text-sm px-3 py-1"
                            onClick={() => navigate(subItem.url)}
                          >
                            {subItem.label}
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink
                    className={cn(
                      "text-sm font-medium text-black cursor-pointer px-4 py-2 hover:text-[#3B2C93]",
                    )}
                    onClick={() => navigate(item.url)}
                  >
                    {item.label}
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side icons */}
        <div className="flex items-center -mx-4">
          {local.cart && (
            <Button
              variant="ghost"
              onClick={() => navigate("/cart")}
              className="rounded-full p-2 aspect-square"
            >
              <ShoppingCart
                color="#3B2C93"
                strokeWidth={2.25}
                className="size-5"
              />
            </Button>
          )}

          {local.profile && (
            <Button
              variant="ghost"
              onClick={() => navigate("/profile")}
              className="rounded-full p-2 aspect-square"
            >
              <User color="#3B2C93" strokeWidth={2.25} className="size-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
