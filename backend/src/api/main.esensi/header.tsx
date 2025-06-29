import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "header",
  url: "/api/header",
  async handler() {
    const logo = {
      img: `_file/upload/esensi-online-logo.png`,
      alt: `Esensi Online`,
    };

    const searchbar = {
      placeholder: `Cari buku...`,
    };

    const cats = await db.category.findMany({
      where: {
        deleted_at: null,
        id_parent: null,
      },
      include: {
        other_category: {
          where: {
            deleted_at: null,
            NOT: {
              id_parent: null,
            },
          },
          include: {
            other_category: {
              where: {
                deleted_at: null,
                NOT: {
                  id_parent: null,
                },
              },
            },
          },
        },
      },
    });

    const buildMenu = (menu: any) => {
      return menu.map((item: any) => {
        const submenu =
          item?.other_category && item.other_category.length > 0
            ? buildMenu(item.other_category)
            : null;
        return {
          label: item.name,
          url: `/category/${item.slug}`,
          newtab: false,
          submenu: submenu,
        };
      });
    };

    const menu_cats = buildMenu(cats);

    const menuItems = [
      {
        label: "Beranda",
        url: "/",
        newtab: false,
        submenu: null,
      },
      {
        label: "Semua E-Book",
        url: "/browse",
        newtab: false,
        submenu: menu_cats,
      },
      {
        label: "Tentang Esensi",
        url: "/about",
        newtab: false,
        submenu: null,
      },
      {
        label: "Hubungi Kami",
        url: "/contact",
        newtab: false,
        submenu: null,
      },
    ];

    const data = {
      logo: logo,
      searchbar: searchbar,
      menu: menuItems,
    };

    return {
      jsx: <></>,
      data: data,
    };
  },
});
