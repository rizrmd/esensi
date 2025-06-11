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
import { StoreFeaturedProducts } from "@/components/esensi/store-featured-products";

export default () => {
  const local = useLocal(
    {
      featured: {
        loading: true,
        list: [] as StoreCategoryItem[],
        length: 0,
        offset: 0,
        animateClass: true,
      },
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
      bundling: {
        slug: "" as any | null,
        img: "" as any | null,
        list: [] as StoreBooksCardItem[],
      },
    },
    async () => {
      const res = await api.index({
        allbooks_cat: local.cats.selected,
        limit: 12,
        bundling_slug: null,
      });

      local.featured.list = res.data.featured;
      local.featured.length = res.data.featured.length;
      local.featured.offset = res.data.featured.length;
      local.featured.loading = false;

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
      changeFeaturedBundle("bundling-montessori-di-rumah");
    },
  );

  const changeStoreCategory = async (cat: string | null) => {
    local.allbooks.loading = true;
    local.render();
    local.cats.selected = cat || "";
    local.allbooks.list = await api
      .index({ allbooks_cat: cat || "", limit: 12, bundling_slug: null })
      .then((res) => res.data.allbooks);
    local.allbooks.loading = false;
    local.render();
  };

  const changeByCategory = async (cat: string | null) => {
    local.booksByCategory.loading = true;
    local.render();
    local.booksByCategory.selected = cat || "";
    local.booksByCategory.list = await api
      .index({ allbooks_cat: cat || "", limit: 10, bundling_slug: null })
      .then((res) => res.data.allbooks);
    local.booksByCategory.loading = false;
    local.render();
  };

  const changeFeaturedBundle = async (cat: string | null) => {
    local.bundling = await api
      .index({ allbooks_cat: null, limit: 10, bundling_slug: null })
      .then((res) => res.data.bundling);
    local.bundling.slug = cat;
    local.render();
  };

  const changeFeaturedOffset = (num: number | null) => {
    if (num === null || num >= 0) {
      num = 1;
    } else {
      num = -1;
    }

    const pos = local.featured.offset + num;

    if (pos > local.featured.list.length * 2) {
      local.featured.animateClass = false;
      local.render();
      local.featured.offset = local.featured.list.length - 2;
      local.featured.animateClass = true;
      local.render();
      local.featured.offset = local.featured.list.length - 1;
    } else if (pos < local.featured.list.length) {
      local.featured.animateClass = false;
      local.render();
      local.featured.offset = local.featured.list.length + 2;
      local.featured.animateClass = true;
      local.render();
      local.featured.offset = local.featured.list.length + 1;
    } else {
      local.featured.offset = pos;
    }
    local.render();
  };

  return (
    <MainEsensiLayout title="Toko Buku">
      <div className="w-full flex flex-col justify-center items-center gap-10 lg:[&>div:not(.esensi-banner)]:max-w-[1200px]">
        <div className="esensi-banner lg:order-0 lg:-mt-10 w-full">
          <StoreHeaderBanner
            img={local.headerBanner.img}
            title={local.headerBanner.title}
            subtitle={local.headerBanner.subtitle}
            btnlabel={local.headerBanner.btnlabel}
            btnurl={local.headerBanner.btnurl}
          />
        </div>
        <div className="hidden lg:flex flex-col gap-6 px-6 w-full">
          <div className="hidden lg:flex w-full">
            <SectionTitle title="Featured Books" url="/browse" />
          </div>
          <StoreFeaturedProducts
            data={local.featured.list}
            loading={local.featured.loading}
            action={changeFeaturedOffset}
            animated={local.featured.animateClass}
            offset={local.featured.offset}
          />
        </div>

        <div className="flex flex-col gap-6 order-0 lg:order-none w-full">
          <div className="hidden lg:flex w-full">
            <SectionTitle title="Berdasarkan Genre" url="/browse" />
          </div>
          <StoreCategories
            action={changeStoreCategory}
            loading={local.cats.loading}
            list={local.cats.list}
            selected={local.cats.selected}
          />
        </div>
        <div className="flex order-2 lg:order-none w-full lg:-mt-10">
          <StoreBooksCard
            loading={local.allbooks.loading}
            list={local.allbooks.list}
            category={local.cats.selected}
          />
        </div>
        <div className="flex flex-col gap-6 w-full order-3 lg:order-none">
          <div className="hidden lg:flex w-full">
            <SectionTitle
              title="Bundling of the Week"
              url={`${
                local.bundling.slug !== "" && local.bundling.slug !== null
                  ? `/bundle/${local.bundling.slug}`
                  : "#"
              }`}
            />
          </div>
          <StoreBundling
            slug={local.bundling.slug}
            img={local.bundling.img}
            list={local.bundling.list}
          />
        </div>
        <div className="order-3 lg:order-none w-full">
          <BooksByCategory
            loading={local.booksByCategory.loading}
            action={changeByCategory}
            categories={local.cats.list}
            selected={local.booksByCategory.selected}
            list={local.booksByCategory.list}
          />
        </div>
      </div>
    </MainEsensiLayout>
  );
};
