import { MainEsensiLayout } from "@/components/esensi/layout";
import { LayoutBookList } from "@/components/esensi/layout-book-list";
import { api } from "@/lib/gen/main.esensi";
import { useLocal } from "@/lib/hooks/use-local";

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

  const local = useLocal(
    {
      title: "" as string,
      loading: true as boolean,
      list: [] as any[],
      pagination: {
        items: 20 as number,
        page: 1 as number,
        total_pages: 1 as number,
        url: {
          prefix: "" as string,
          suffix: "" as string,
        },
      } as any,
      breadcrumb: [] as any,
      isBundle: false as boolean,
    },
    async () => {
      local.list = data.list;
      local.pagination = data.pagination;
      local.title = `${data.title}${
        data.pagination.page > 1 ? ` | Page #${data.pagination.page}` : ""
      }`;
      local.breadcrumb = data.breadcrumb;
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
        pagination={local.pagination}
        isBundle={local.isBundle}
        breadcrumb={local.breadcrumb}
      />
    </MainEsensiLayout>
  );
};
