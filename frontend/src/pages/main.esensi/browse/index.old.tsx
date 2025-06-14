import { useLocal } from "@/lib/hooks/use-local";
import { api } from "@/lib/gen/main.esensi";
import { MainEsensiLayout } from "@/components/esensi/layout";
import {
  LayoutBookList,
  type BooksCardType,
} from "@/components/esensi/layout-book-list";

export default () => {
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
      const res = await api.browse();
      local.list = res.data.list;
      local.page = res.data.page;
      local.total_pages = res.data.total_pages;
      local.loading = false;
      local.render();
    },
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
