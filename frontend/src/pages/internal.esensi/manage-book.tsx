import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { book, Item } from "@/components/ext/book/item-manage";
import { Error } from "@/components/ext/error";
import { Img } from "@/components/ext/img/list";
import { LayoutToggle } from "@/components/ext/layout-toggle";
import { MenuBarInternal } from "@/components/ext/menu-bar/internal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataPagination } from "@/components/ui/data-pagination";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { ItemLayoutEnum } from "@/lib/utils";
import { Role, type Book } from "backend/lib/types";

export default () => {
  const local = useLocal(
    {
      books: [] as Book[],
      loading: true,
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 0,
      error: "",
      layout: ItemLayoutEnum.GRID,
    },
    async () => {
      const params = new URLSearchParams(location.search);
      local.page = parseInt(params.get("page") || ("1" as string)) as number;
      local.limit = parseInt(params.get("limit") || ("50" as string)) as number;
      await loadData();
    }
  );

  async function loadData() {
    local.loading = true;
    local.render();
    try {
      const res = await api.book_list({
        page: local.page,
        limit: local.limit,
      });
      local.books = res.data || [];
      local.total = res.pagination!.total || 0;
      local.page = res.pagination!.page || 0;
      local.limit = res.pagination!.limit || 0;
      local.totalPages = res.pagination!.totalPages || 0;
    } catch (error) {
      local.error = "Terjadi kesalahan saat memuat data.";
    } finally {
      local.loading = false;
      local.render();
    }
  }

  if (local.loading) return <AppLoading />;

  return (
    <Protected role={[Role.INTERNAL]}>
      <div className="flex min-h-svh flex-col bg-gray-50">
        <MenuBarInternal />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <Error msg={local.error} />
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="mx-8 py-8">
                <div className="flex justify-between items-start mb-8 gap-4">
                  <h1 className="text-2xl font-bold">Daftar Buku</h1>
                  <div className="flex flex-col gap-3 items-end">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <LayoutToggle
                          layout={local.layout}
                          onLayoutChange={(value) => {
                            local.layout = value;
                            local.render();
                          }}
                        />
                      </div>
                    </div>
                    <DataPagination
                      total={local.total}
                      page={local.page}
                      limit={local.limit}
                      totalPages={local.totalPages}
                      onReload={loadData}
                      onPageChange={async (newPage) => {
                        local.page = newPage;
                        local.render();
                        await loadData();
                      }}
                      onLimitChange={async (newLimit) => {
                        local.limit = newLimit;
                        local.page = 1;
                        local.render();
                        await loadData();
                      }}
                    />
                  </div>
                </div>
                {local.loading ? (
                  <div>Mengambil data buku...</div>
                ) : local.books.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    Belum ada buku.
                  </div>
                ) : (
                  <>
                    {local.layout === ItemLayoutEnum.GRID && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {local.books.map((item: Book) => (
                          <div
                            key={item.id}
                            className="cursor-pointer"
                            onClick={() => navigate(`/book-step?id=${item.id}`)}
                          >
                            <Card className="flex flex-col h-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                              <Img
                                type={local.layout}
                                check={!!item.cover}
                                src={
                                  baseUrl.internal_esensi +
                                  "/" +
                                  item.cover +
                                  "?w=350"
                                }
                                alt={item.name}
                              />
                              <CardHeader className="flex-1">
                                <CardTitle className="text-lg font-semibold line-clamp-2 mb-2">
                                  {item.name}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pb-4">
                                <Item type={local.layout} item={book(item)} />
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    )}

                    {local.layout === ItemLayoutEnum.LIST && (
                      <div className="flex flex-col gap-4">
                        {local.books.map((item: Book) => (
                          <Card
                            key={item.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => navigate(`/book-step?id=${item.id}`)}
                          >
                            <div className="flex">
                              <Img
                                type={local.layout}
                                check={!!item.cover}
                                src={
                                  baseUrl.internal_esensi +
                                  "/" +
                                  item.cover +
                                  "?w=350"
                                }
                                alt={item.name}
                              />
                              <div className="flex-1 p-4">
                                <h3 className="text-lg font-semibold mb-2">
                                  {item.name}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  <Item type={local.layout} item={book(item)} />
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}

                    {local.layout === ItemLayoutEnum.COMPACT && (
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="p-2 text-left text-xs font-medium text-gray-600">
                                Buku
                              </th>
                              <th className="p-2 text-left text-xs font-medium text-gray-600">
                                Penulis
                              </th>
                              <th className="p-2 text-left text-xs font-medium text-gray-600">
                                Harga
                              </th>
                              <th className="p-2 text-left text-xs font-medium text-gray-600">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {local.books.map((item: Book, index) => (
                              <tr
                                key={item.id}
                                className={`border-b hover:bg-muted/50 cursor-pointer ${
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }`}
                                onClick={() =>
                                  navigate(`/book-step?id=${item.id}`)
                                }
                              >
                                <td className="p-2">
                                  <Img
                                    type={local.layout}
                                    check={!!item.cover}
                                    src={
                                      baseUrl.internal_esensi +
                                      "/" +
                                      item.cover +
                                      "?w=350"
                                    }
                                    alt={item.name}
                                  />
                                </td>
                                <Item type={local.layout} item={book(item)} />
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Protected>
  );
};
