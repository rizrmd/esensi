import { Button } from "../ui/button";
import { navigate } from "@/lib/router";
import { ChevronLeft, Search, ShoppingCart, User } from "lucide-react";
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
  title = "Esensi Online" as string,
  back = true as boolean,
  logo = true as boolean,
  search = true as boolean,
}) => {
  const local = useLocal({ searchQuery: "" }, async () => {
    // async init function
  });

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      navigate(`/search/${encodeURIComponent(local.searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 lg:static flex flex-row justify-center items-center w-full bg-background lg:h-36">
      <div className="container flex h-14 items-center">
        {/* Back Button */}
        {back && (
          <Button
            variant="ghost"
            size="icon"
            className="flex lg:hidden mr-2"
            onClick={() => history.back()}
          >
            <ChevronLeft className="size-6" color="#9F9E9E" />
          </Button>
        )}

        {/* Logo */}
        {logo && (
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABTCAMAAADtJ7gsAAAC7lBMVEUAAAAwML8wMMEwML8wMMIwML8wML8wMMAwML8wMMEwML8wMMAwMMAwMMIwML8wMMAwML8lJV8oKHcrK5AwMMEwML80M9MwMMAxMccpKYImJWMsLJowMMQrKo4pKHslJVwgIEgoJ3QsK5QwMNQsK5QgIDIlJWY1NNk4N+ggIDcwMMInJ4k1NeE0NNgpKHwfHzQjI1IfHzAvLqogIC81NNkkJFo4N/QwMMUjI1c2NekkJFcvLqosK5AkJFc1NNglJVoeHi46Of4zM9EfHzEpKXorKockJFkqKYkgIDYzMtIjI1MzMtMyMcIrK5EfHy4zMs8uLZ0oJ3QkJFM0M9QwMMAtLaI3NukvL6grK4stK5c3NuswMLYnJ3E0M9wmJl8uLqYoKHwkJF40M9YzMs0qKX4hIDctLaA2NeIxML4wL7AmJmMiIUgvLqYtLJg4N/MqKYQhIUA1NNQiIkQ3NuEtLJ00MswvL6cgIC8sLJo2NekrK5EgICo1NOA1Ndw0NNowL68pKXImJmAkI046Of85OPo4N/E2NdwnJmc7Ov8xMLgoKHAwL6owMMEoKHIwLaM6Ov81Nf8qJY8wMMEvLqkyMcIoJ3InJmouLaEtLJgqKoQqKYAwL7IuLaMrKoswMLU0M88xMLkvL64uLqcpKHksK5ErK40pKXszMssxMLgnJ20zMsgwL7EtLZ0hIT0zMskxMcAyMsYmJmUqKoc1NNk0NNYlJFojI00mJWIjI1AhIUExMb0qKoYnJ28jIkoiIkctLZ8pKX4mJmclJV0kJFYvL68tLJosK5YoKHUlJVsvLqwuLaUiIUQ1NN4yMcQqKoknJmwgIDo0M9EsLJQoKHYmJmM1NNs0M9Q0M9IxMLwwL7QlJWA1NNcvLqskJFgjI1MgIDU2NeAsK5MpKX0nJ3AkJFUgIDcxML4mJmgfHzEfHy41NNgxMLstLJwrK48qKYIgHzM2NeIzMs05OP82NuY4N/I3NuowL7c5OPc4N+0zM9D9V8fAAAAAknRSTlMAQN8gv4BgvxDvcJ9Qn6DfkP7+/s8w/q8f/v7+f/7+/h/+HxD+QDC/IBCPEP5v39nPuY+Af39wb1A/79/fv6+fn5CQkI+AcG9gQP3v7+/v39/f38/Pv7qvpZ9/f39gYEBAP+/v7+/u39/f39/Pz8e/v5+fj4B/b29fT08v7+/v7+/v79/f39/fz8+/n49gUDAwMBd/picAAA0BSURBVHja1Zt3XFNXFMfvey95GSYUITGsOsBRV92t1aptraN777333nvvHdQyVLQiQ2kVwdoirSgISAFbQQXUlorFqsVBW1v/67mL+x4vaUhwwC/6MV4e4XzzO+fcm5yAQtDggTePmzLp8gm7iosnjJw0biDqjuo7fcrI4uIdxTt27FhJVF5ePqkv6maaPmUCxI+D79OnHG7r1vUENTS81s1MGQjhA8I6HH8D3FatilkFf2tra+8fjLqTbsPhQ+gYICYmpjYXtBZr9+6bUXfSbTG1cMslwtHvnsO18UbUnTQeogfx4Ods3LgxOzu7MLuwsKl7gQyE8CF2iB7Cx2qazdTvI9RdlHDeOQlDs3HwIBb97DKsfjUREREnqm1ZJQkFoajhgy7oNRahy3D8Zf36lZXV1ETURIAWYWVknIpOjE63eb2yu4NW3PTY7fm9ev00Ge7fCPEvglsEDn5RBqh3RsbOnUVF09AJkeLFklFgnTF20LZt+b2A44oEXCQZTL1x9EUpoGi4paTEo/ZyODUaoqJjItVLFIX+V6cMH/RyHmBs6bX1p7Rz6NojED3X/uj90clU1yKDzF6dZAWBjjsI5NMTb2/Oy9vLMO5wsPX4O6P3JyfDH6zVq1eAqlesODM+EAiQWNHRl9VGU8t/PlVuxhj5GONI2iVPJSCuGatX4Pirq6vnVc+jWrx4GgoEAjKjYyC37PVaFN/5NPnFxspK6sbtFwya/NhwfVOYRoOnijz55JaWyDNRR0Bc6JhI8YGR8NwT9wxrbCRubMsnSXXJ6Yb8m9YCwbdERqZj/YoV7x/EoQih46Mzrr/64MGDw5gbe/O3bIHaSEvLvOMp1E4zLkpP79+//yZQaWlpUtKTyD+IhAySnDJ8wWZyKpo1j4yX7GJJUYc4XTLI5VG1RRFnwmUhm9ii3YHa6bQ//2QYosTTDmVmfrVkiaHhxF+XxBW7PvZSFAyIYvJymdowgIIpji2ZdH3Cod3/QOKRZa+sIp3AjkaMsVmP8dWS5curCIkeZfRD63P+yMG6ND4YEEX2CkWJHipIjCAgB+PQLPWgIHDPrqvxYRiDdqp8hgEUGGPWrGX3akmGPn3V3Tlr1qz5nOpjFAyIUxuelTYefcx2XyA2q+FZCKcg9ItCN2kxjjA3GMayggIL4rrlKkowF6tibsWT6H9BbDKWaQh/JmSyGK6qZo/s4ktYlnCzhcfMQWwnWSyypnc7aPezq3a41sG/WW/JZF4bUOJ6jOaCgn0LsuzMjdEk/oqKL4gSE69BfkF8buxezQ9WNIllFt+itoFYxKKJ3hU+Wq0CpAcSeikvL4/WxhFW4surAGNWc0Fd3YIFWfNH09J48ItECJ9oO2jDxKGBQMTGLkCcSCOXZm820bAEiDBHPCQ31yfIediNfJ0bs2hS1S3Iyjo8f76bcEzE8W8ALcQqKXlFQR0FEakAcjlEP9Xu+nYKpQcJ5z5AahE5Ff8gY1mnAg7hBmDsw27Mr6+/D2HdR6IvWUqVmpqqokAgJ7XJrsOTedVIlMxERCuoHYi9rcNZbbxxq/5ABm2BgzrUOLhBOIACimPfvgXgRn1q6lKSWTdA7KD61Pr59fOxbkBYQXUtq2g8Q6y0gA1qB6JSEH2jllWfIAl838hs61TLaG0AxtKlJQtvwbVJoz+cdTgrK2sByIOCB0FKmL4BqMGAIFW3dRpBHFt1bkCrwkl1GDhSUwFj4URiCEQP2revDv7UFRSIzSXII4pHu7VLBg6bXxCQYm9DkXyAnAMYrMQJRh2ujSySVJhj+wcI5IHgQc3NzctAsy5UUEggIMUst8WiiIYs5B8EozNPTT5ArqAY3A2GUU/c2LA9MfEWBLLg8LmqqlQUKoh+y7DR5txRELHD24wgCTSpMAVg1LW5UVKyYUNiImwdCOvCqqqq5VhLsOJQp0AQ67q8u3qUIEDYYxtBzuNJ1QwYuFPx2gAM2ADn0u2bxP8VUWamCQUG0cpm4u3WrEqK4h7CHBFF4jHDucXJz+xhAkQSIFa7WXIrikPfpgVI3HLRcGmn4hjAUTF37rMI5M4EHco8lIZ1SVRQIOLoEadbUtiGxyU8lASI1UZAWEoJefgmI0BMVVXapNK5MRcOiPHEtrRDRwDhJ9DWC6JQ8CA2RXfSFQE4dYvhLCYGwoONMlyoEEqXFuRCsovrMbZTDOBYQ185Dd+6dUsvuG2BA/JwFDQIyExiErJYfV3KktZqYiAgMwPRGmJTeeELEDfYocEADupGBcHI+eM62qLz87eB9u7dmzcWdUCqpb3s8GPDLTwQi6TdJXmMJ4W3LaueD9u+Hk6gVXGZ2YrEdbx5O5phFyclzjC2A0dFBVAARs769c/TUwycjzdjVQ5CnZHVLTmg3g3LEkjpyHvWqsPt5zozdYNjbMAV/gXD+GN9UlI83WsqKysb4WVk4z2noC4qD8Go19QGdQMoACPpIUTU2Dhs2EGsLsuB3iO1kQoYC7draiMnNjY2Kal0Ey2RhD+ZTkNdVqI2CAavDaBI2rTp1/Rn6dtef1Ndj7qs3KzhcjdYUmE3ACM98jOE9dy/RA+jrivH0qXtMXCJl5Zu6g8Yiy9CRNf/hfVW1y0QhJ4u0dXGmhzqRv9f0yNbTl68+BH2Bh5g/PNPV+ZAo8m+gTF4w6VJFRkJGPOqz0VED/8DOp6FbnVIKDhdQzAqGEZsUimtjZYWjFFdPQMRvdna2no2OrbyuMQbJHHBT7muMtQGYMDgA6Yg1StWJ9+KiIDjXRSaFLfk7tC4yiReK0rs3BWMHhS1wZIqnSYVxkhOpvv6J62tb4RSIFY7jAGwXE6pAyAgSXuORMFoInCQpKKditXGvBUYY39KCpuetLZ+GgJGnC2IeSgFCQ8Z5G7WqWKZG6Q2AGM1xig6lY1PWkModDhi6xXXARCXJrV6oGBEOhVQ4IZL7AAMklTRKUVFOxnI2WeHwCHsECQBQWS2u8nkBUswwrWB3eiP3WBJhbMKMOBzDRwkRD/YdKANyd5BEJAS7DwbuyGSah4t8RTIqp0Z8DGTy1CocrJhLqledxiDUgKDhCrRqZgbq/enQFb1BoyIiLKQQSQaeRh/Xu26l+SKasazThuedSq+QMwOzYspu9ME19rYwEjIoZuhXkSSCkoD3KAlHl0EbvReVFNTVjb71c4ZIhtGWFbDOyey3QeIGIFKXq2cVuRvhnomTSqOER2dsnNnBtgBHPCZpsJQTxheIkmzYhPvCoUZ5oYGEJDDCMK7mnGGCiCwiwMGZFUy5kjBbsAnmWrK+s1uKizc2LcTmSUMEZb0ECBCbgOIcE/y/VEQyfBcXMvcwP0WY5DiAApwozB745zxoYHYadRGNpcAgVnnlaxyDCDCPYlfa2H9wt8M9do2jBRc4gIjGzDmzJkeGki4sdsq1CQBIgY9Nt8gZgEiiYYu+ZmhzhAYkFSAgWsDsgpj7F6bOyU0kDD26Fp5ifQgiE5LogKCCGo7udY4Q30eY+wnSUUweFIBB3y8t/b+Ywyi0iIJDCImp35mqEOTWYlnZFA3mhjG2tzcmJhVDX2PFojVkFriWZYCgojVHv5mqKdCUomG29REa2Pt2lz44HtDz3XjQgIxiyL2W+x0NXgQfzPUcyGpFvHaADcYRm3tqgbgKB8ZEoiDRm1sZJ7Og/ibod5KMMpwqwI3sqHEcVLVYjfW9Vm5csdtnd4QtQ1TPSogEjuOCl2J0NA7cYlTDHADOChGT4JRXDwJhSJT+xerp/OxRudB/M1Qz60pIzVO3VjL3SgvX1lcXLzr55/Hd+LQGCf+z6PoPIi/Geqts7VJVRuzqmfPPuXEjV2A8c03r/cN2RLwxE1f9PI5kx8QsSr9D4iNgIgN16Qgnd5vots4xoDfcqFucIyvv/565OAQQNw2fro1mVzwj67zCxCFxSnOxE4HLyiz7gKQi4IYZqj8wykDwQ3RcKFTrdRifPfd9yOD9sR3ZwnTtQKNc5I2OAtv32bDmyscxDhDZVUCWZWLGy5QsBL/eRfDAI7vf3hgAGqnF14I3IJtvjhEGKx4RByyOEJaZQYiLiCrAWaoQ9+h+8Y66gaU+PmAQSkA44dvv/3ycQ3K4AFTR3XEIyXMa5xfChLunI3HqVASB79v1l0gZp/+Z6hoIOlUoja+0bhBOL788scRo8bMHDBz5pizRuwZwakCo8h8+GnXtxgpzKKZdbo5lEUErXpU4wWwajfOUK8UM9SbGxoYBrhxPuMQGMDx42+//HLgwO+/79lz8ZgAxR/KmFNcr3TuwcexpNK58T1QcAzgIBh7pnbx3zkcRzEoB68N4QbHOKvr/zrr+AmAYawNoGBu/A4YA1A3UN/LdW6AMMaPHANqo+u7wTT9cu4GphAYB8CMUc908drQm/L4AxRDlPgBjHHx1G6RUzqUmY/qShwwRo3pdhSMZfzUR0fcBW7cNWLUWc8M6CYZ9R/2T2EiwEfiuwAAAABJRU5ErkJggg=="
            alt="Esensi Online"
            className="h-8 w-auto lg:h-16"
          />
        )}

        {/* Search Bar */}
        <div className="flex-1 ml-4 mr-2 lg:ml-12 lg:mr-4">
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

        {/* Navigation Menu */}
        <NavigationMenu className="hidden lg:flex ml-4 lg:mx-8">
          <NavigationMenuList>
            {menuItems.map((item, index) => (
              <NavigationMenuItem key={index}>
                {item.submenu ? (
                  <>
                    <NavigationMenuTrigger className="text-black">
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
                      "text-sm font-medium text-black cursor-pointer px-4 py-2 hover:text-primary"
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
        <div className="flex items-center pr-2">
          <Button variant="ghost" onClick={() => navigate("/cart")}>
            <ShoppingCart color="#3B2C93" strokeWidth={2.25} className="size-5" />
          </Button>
          <Button variant="ghost" onClick={() => navigate("/profile")}>
            <User color="#3B2C93" strokeWidth={2.25} className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
