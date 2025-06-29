import CSS from "csstype";
import { MainEsensiLayout } from "@/components/esensi/layout";
import { api } from "@/lib/gen/main.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { CategoryList } from "@/components/esensi/category-list";

export default (data: Awaited<ReturnType<typeof api.search>>["data"]) => {
  const header_config = {
    enable: true,
    logo: true,
    back: false,
    search: true,
    title: null,
    cart: true,
    profile: true,
  };

  const local = {
    title: "" as string,
    loading: true as boolean,
    list: [] as any[],
    trending: [] as any | null,
    categories: [] as any | null,
  };

  const localBanner = useLocal({
    img: `` as string,
  }, async()=>{
    const get = await api.banner({ for: "booklist" });
    if (get?.data) {
      localBanner.img = get.data?.img;
    }
    localBanner.render();
  });

  if (data?.categories) {
    local.categories = data.categories;
    local.trending = data.trending;
    local.title = `Cari Ebook terbaik di Esensi Online`;
    local.loading = false;
  }

  const bannerCSS: CSS.Properties = {
    backgroundImage: `url(/${localBanner.img})`,
  };

  const renderTrending = local.trending !== null &&
    local.trending.length > 0 && (
      <div className="flex w-full items-start flex-col gap-3">
        <h3 className="font-bold text-[#393B69]">Populer</h3>
        <div className="flex flex-col gap-2"></div>
      </div>
    );
  const renderCategories = local.categories !== null &&
    local.categories.length > 0 && (
      <div className="flex w-full items-start flex-col gap-3">
        <h3 className="font-bold text-[#393B69]">Kategori</h3>
        <div className="flex flex-wrap gap-2">
          <CategoryList data={local.categories} />
        </div>
      </div>
    );
  return (
    <MainEsensiLayout header_config={header_config}>
      <div className="flex flex-col w-full items-center">
        <div
          className="hidden lg:flex justify-center w-full h-auto p-6 bg-cover bg-center bg-no-repeat text-white text-lg font-semibold lg:text-3xl lg:h-40 lg:items-center"
          style={bannerCSS}
        >
          <h2 className="w-full max-w-[1200px]">{local.title}</h2>
        </div>
        <div className="flex justify-center w-full max-w-[1200px]">
          <div className="flex flex-col items-start p-4">
            {renderTrending}
            {renderCategories}
          </div>
        </div>
      </div>
    </MainEsensiLayout>
  );
};
