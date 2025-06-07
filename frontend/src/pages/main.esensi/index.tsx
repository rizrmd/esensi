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
      <div className="w-full flex flex-col justify-center gap-10">
        <div className="w-full flex flex-col justify-center lg:hidden">
          <StoreCategories
            action={changeStoreCategory}
            loading={local.cats.loading}
            list={local.cats.list}
            selected={local.cats.selected}
          />
        </div>
        <div className="w-full flex flex-col justify-center gap-10 md:gap-20 lg:px-16 lg:pb-8">
          <div className="w-full flex flex-col justify-center lg:hidden">
            <StoreBooksCard
              loading={local.allbooks.loading}
              list={local.allbooks.list}
              category={local.cats.selected}
            />
          </div>
          <BooksByCategory
            loading={local.booksByCategory.loading}
            action={changeByCategory}
            categories={local.cats.list}
            selected={local.booksByCategory.selected}
            list={local.booksByCategory.list}
          />

          <FeaturedBooks />
        </div>
      </div>
    </MainEsensiLayout>
  );
};
