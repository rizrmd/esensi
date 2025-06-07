import {
  StoreCategories,
  type StoreCategoryItem,
} from "@/components/esensi/store-categories";
import {
  StoreBooksCard,
  type StoreBooksCardItem,
} from "@/components/esensi/store-books-card";
import { FeaturedBooks } from "@/components/esensi/featured-books";
import { BooksByCategory } from "@/components/esensi/books-by-category";
import { useLocal } from "@/lib/hooks/use-local";
import { api } from "@/lib/gen/main.esensi";
import { MainEsensiLayout } from "@/components/esensi/layout";
import { dbClient } from "rlib/client";
import { StoreHeaderBanner } from "@/components/esensi/store-header-banner";
import { SectionTitle } from "@/components/esensi/section-title";
import { StoreBundling } from "@/components/esensi/store-bundling";

export default () => {
  const local = useLocal(
    {
      cats: {
        loading: true,
        list: [] as StoreCategoryItem[],
        selected: "",
      },
      allbooks: {
        loading: true,
        list: [] as StoreBooksCardItem[],
      },
      booksByCategory: {
        loading: true,
        selected: "",
        list: [] as StoreBooksCardItem[],
      },
      headerBanner: {
        img: "",
        title: "",
        subtitle: "",
        btnlabel: "",
        btnurl: "",
      },
      bundling:{
        img: "",
        desktopImg: "",
        url: "",
        list: [] as StoreBooksCardItem[],
      },
    },
    async () => {
      const res = await api.index({
        allbooks_cat: local.cats.selected,
        limit: 12,
      });

      local.cats.list = res.data.categories;
      local.cats.loading = false;

      local.allbooks.list = res.data.allbooks;
      local.allbooks.loading = false;

      local.headerBanner.img = "";
      local.headerBanner.title = "Dunia Baru Dimulai Dari Satu Halaman";
      local.headerBanner.subtitle = "Lorem ipsum dolor sit amet.";
      local.headerBanner.btnlabel = "Find out";
      local.headerBanner.btnurl = "#";

      local.render();
      changeByCategory(res.data.categories[0].slug);
    }
  );

  const changeStoreCategory = async (cat: string | null) => {
    local.allbooks.loading = true;
    local.render();
    local.cats.selected = cat || "";
    local.allbooks.list = await api
      .index({ allbooks_cat: cat || "", limit: 12 })
      .then((res) => res.data.allbooks);
    local.allbooks.loading = false;
    local.render();
  };

  const changeByCategory = async (cat: string | null) => {
    local.booksByCategory.loading = true;
    local.render();
    local.booksByCategory.selected = cat || "";
    local.booksByCategory.list = await api
      .index({ allbooks_cat: cat || "", limit: 10 })
      .then((res) => res.data.allbooks);
    local.booksByCategory.loading = false;
    local.render();
  };

  return (
    <MainEsensiLayout title="Toko Buku">
      <div className="w-full flex flex-col justify-center gap-4">
        <div className="order-1 lg:order-none">
          <StoreHeaderBanner
            img={local.headerBanner.img}
            title={local.headerBanner.title}
            subtitle={local.headerBanner.subtitle}
            btnlabel={local.headerBanner.btnlabel}
            btnurl={local.headerBanner.btnurl}
          />
        </div>
        <div className="hidden lg:flex w-full">
          <SectionTitle title="Featured Books"  url="/browse" />
        </div>

        <div className="hidden lg:flex w-full">
          <SectionTitle title="Berdasarkan Genre"  url="/browse" />
        </div>
        <div className="order-0 lg:order-none">
          <StoreCategories
            action={changeStoreCategory}
            loading={local.cats.loading}
            list={local.cats.list}
            selected={local.cats.selected}
          />
        </div>
        <div className="order-2 lg:order-none">
          <StoreBooksCard
            loading={local.allbooks.loading}
            list={local.allbooks.list}
            category={local.cats.selected}
          />
        </div>
        <div className="order-3 lg:order-none">
          <BooksByCategory
            loading={local.booksByCategory.loading}
            action={changeByCategory}
            categories={local.cats.list}
            selected={local.booksByCategory.selected}
            list={local.booksByCategory.list}
          />
        </div>
        <div className="hidden lg:flex w-full">
          <SectionTitle title="Bundling of the Week"  url="#" />
        </div>
        <div className="hidden lg:flex">
          <StoreBundling img={local.bundling.img} desktopImg={local.bundling.desktopImg} url={local.bundling.url} list={local.bundling.list} />
        </div>
      </div>
    </MainEsensiLayout>
  );
};
