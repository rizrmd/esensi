import { MainEsensiLayout } from "@/components/esensi/layout";
import {
  LayoutBookList,
  type BooksCardType,
} from "@/components/esensi/layout-book-list";
import { api } from "@/lib/gen/main.esensi";
import { useLocal } from "@/lib/hooks/use-local";

export default (data: Awaited<ReturnType<typeof api.browse>>["data"]) => {
  const header_config = {
    enable: true,
    logo: true,
    back: false,
    search: true,
    title: null,
    cart: true,
    profile: true,
  };

  const local = useLocal(
    {
      title: "" as string,
      loading: true as boolean,
      list: [] as BooksCardType[],
      page: 1 as number,
      total_pages: 1 as number,
      filters: {
        options: [
          {
            name: "",
            type: "select",
          },
        ],
      },
    },
    async () => {
      local.list = data.list;
      local.page = data.page;
      local.total_pages = data.total_pages;
      local.title = `Dunia Baru Dimulai dari Satu Halaman${
        data.page > 1 ? ` | Page #${data.page}` : ""
      }`;
      local.loading = false;
      local.render();
    }
  );

  return (
    <MainEsensiLayout header_config={header_config}>
      <LayoutBookList
        title={local.title}
        loading={local.loading}
        list={local.list}
        page={local.page}
        total_pages={local.total_pages}
      />
    </MainEsensiLayout>
  );
};
