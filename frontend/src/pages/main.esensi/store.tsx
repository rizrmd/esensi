import { PageHeader } from "@/components/esensi/page-header";
import { PageFooter } from "@/components/esensi/page-footer";
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

export default () => {
  const local = useLocal(
    {
      cats_loading: true,
      cats_list: [] as StoreCategoryItem[],
      allbooks_loading: true,
      allbooks_list: [] as StoreBooksCardItem[],
    },
    async () => {
      const res = await api.store();
      local.cats_list = res.categories.map((e) => {
        return {
          name: e.name,
          slug: e.slug,
        };
      });
      local.cats_loading = false;

      local.allbooks_list = res.allbooks;
      local.allbooks_loading = false;
      local.render();
    },
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="w-full flex flex-col justify-center gap-10">
          <StoreCategories
            loading={local.cats_loading}
            list={local.cats_list}
          />
          <div className="w-full flex flex-col justify-center gap-10 md:gap-20 lg:px-16 lg:pb-8">
            <StoreBooksCard
              loading={local.allbooks_loading}
              list={local.allbooks_list}
            />
            <BooksByCategory
              category="parenting"
              title="Parenting"
              subtitle="Buku tentang parenting"
            />
            <FeaturedBooks />
            <BooksByCategory
              category="parenting"
              title="Parenting"
              subtitle="Buku tentang parenting"
            />
            <BooksByCategory
              category="parenting"
              title="Parenting"
              subtitle="Buku tentang parenting"
            />
          </div>
        </div>
      </div>
      <PageFooter />
    </div>
  );
};
