import { useLocal } from "@/lib/hooks/use-local";
import { api } from "@/lib/gen/main.esensi";
import { MainEsensiLayout } from "@/components/esensi/layout";
import {
  LayoutBookList,
  type BooksCardType,
} from "@/components/esensi/layout-book-list";

export default () => {
  const local = useLocal(
    {
      header_config: {
        enable: true,
        logo: true,
        back: false,
        search: true,
        title: null,
        cart: true,
        profile: true,
      },
      list: [] as BooksCardType[],
      page: 1 as number,
      total_pages: 1 as number,
    },
    async () => {
      const res = await api.browse();
      local.list = res.data.products;
      local.page = res.data.page;
      local.total_pages = res.data.pages;
      local.render();
    },
  );

  return (
    <MainEsensiLayout header_config={local.header_config}>
      adsa
    </MainEsensiLayout>
  );
};
