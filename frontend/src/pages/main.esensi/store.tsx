import { StoreCategories, type StoreCategoryItem } from "@/components/esensi/store-categories";
import { StoreBooksCard, type StoreBooksCardItem } from "@/components/esensi/store-books-card";
import { FeaturedBooks } from "@/components/esensi/featured-books";
import { BooksByCategory } from "@/components/esensi/books-by-category";
import { useLocal } from "@/lib/hooks/use-local";
import { api } from "@/lib/gen/main.esensi";
import { MainEsensiLayout } from "@/components/esensi/layout";

export default () => {
  const local = useLocal(
    {
      cats_loading: true,
      cats_list: [] as StoreCategoryItem[],
      cats_selected: "Mbak Nurul" as string | null,
      allbooks_loading: true,
      allbooks_list: [] as StoreBooksCardItem[],
    },
    async () => {
      const res = await api.store({allbooks_cat: local.cats_selected});
      local.cats_list = res.data.categories;
      local.cats_loading = false;

      local.allbooks_list = res.data.allbooks;
      local.allbooks_loading = false;


      local.cats_selected = "Harusnya ganti dongs";
      
      local.render();
    }
  );

  const changeStoreCategory = ( cat: string | null) => {
    local.cats_selected = cat;
    local.render();
  }

  
  return (
    <MainEsensiLayout title="Toko Buku">
      <div className="w-full flex flex-col justify-center gap-10">

        <h1>TES LOCAL APAKAH UPDATE: {local.cats_selected}</h1>

        <StoreCategories action={changeStoreCategory} loading={local.cats_loading} list={local.cats_list} selected={local.cats_selected} />
        <div className="w-full flex flex-col justify-center gap-10 md:gap-20 lg:px-16 lg:pb-8">
          <StoreBooksCard loading={local.allbooks_loading} list={local.allbooks_list} />
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
        </div>
      </div>
    </MainEsensiLayout>
  );
};
