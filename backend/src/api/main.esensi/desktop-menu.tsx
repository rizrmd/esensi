import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "desktopmenu",
  url: "/api/desktopmenu",
  async handler() {
    const cats = await db.category.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
          where: {
            deleted_at: null,
          },
        },
      },
    });

    let parentcat = [] as any;
    let parentcat_ids = [] as any;
    let subcat = [] as any;
    cats.map((cat, idx) => {
      if (cat.id_parent == null) {
        let newCat = {
          label: cat.name,
          url: `/category/${cat.slug}`,
          newtab: false,
          submenu: [] as any,
        };
        parentcat.push(newCat);
        parentcat_ids.push(cat.id);
      } else {
        subcat.push(cat);
      }
    });

    /*
    subcat.map((sub: any)=>{
      const idx = parentcat_ids.indexOf(sub.id_parent);
      const newCat = {
          label: sub.name,
          url: `/category/${sub.slug}`,
          newtab: false,
          submenu: [],
        };
      parentcat[idx].submenu.push(newCat);
    });
*/

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
        submenu: parentcat,
      },
      {
        label: "Tentang Esensi",
        url: "/about",
        newtab: false,
        submenu: null,
      },
    ];

    const data = {
      menu: menuItems,
    };

    return {
      jsx: <></>,
      data: data,
    };
  },
});
