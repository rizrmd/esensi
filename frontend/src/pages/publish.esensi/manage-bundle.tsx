import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { Item, bundle } from "@/components/ext/bundle/item-manage";
import { Error } from "@/components/ext/error";
import { Img } from "@/components/ext/img/list";
import { MenuBarPublish } from "@/components/ext/menu-bar/publish";
import { PublishFallback } from "@/components/ext/publish-fallback";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataPagination } from "@/components/ui/data-pagination";
import { betterAuth } from "@/lib/better-auth";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { ItemLayoutEnum } from "@/lib/utils";
import type { User } from "backend/lib/better-auth";
import { Role } from "backend/lib/types";
import { PlusCircle } from "lucide-react";

export const current = {
  user: undefined as User | undefined,
};

export default () => {
  const local = useLocal(
    {
      bundles: [] as any[],
      loading: false,
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

      const res = await betterAuth.getSession();
      current.user = res.data?.user;
      await loadData();
    }
  );

  async function loadData() {
    local.loading = true;
    local.render();
    try {
      const res = await api.bundle_list({
        user: current.user!,
        page: local.page,
        limit: local.limit,
      });
      local.bundles = res.data || [];
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
    <Protected role={[Role.AUTHOR, Role.PUBLISHER]} fallback={PublishFallback}>
      <div className="flex min-h-svh flex-col bg-gray-50">
        <MenuBarPublish />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <Error msg={local.error} />
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="mx-8 py-8">
                <div className="flex justify-between items-start mb-8 gap-4">
                  <h1 className="mb-6 text-2xl font-bold">Daftar Bundle</h1>
                  <div className="flex flex-col gap-3 items-end">
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={() => navigate("/bundle-create")}
                        className="flex items-center gap-2"
                        variant="default"
                      >
                        <PlusCircle className="h-5 w-5" />
                        <span>Tambah Bundle</span>
                      </Button>
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
                        layout={local.layout}
                        onLayoutChange={(value) => {
                          local.layout = value;
                          local.render();
                        }}
                      />
                    </div>
                  </div>
                </div>
                {local.loading ? (
                  <div>Mengambil data bundle...</div>
                ) : local.bundles.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    Belum ada bundle.
                  </div>
                ) : (
                  <>
                    {local.layout === ItemLayoutEnum.GRID && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {local.bundles.map((item: any) => (
                          <div
                            key={item.id}
                            className="cursor-pointer"
                            onClick={() =>
                              navigate(`/bundle-update?id=${item.id}`)
                            }
                          >
                            <Card className="flex flex-col h-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                              <Img
                                type={local.layout}
                                check={!!item.cover}
                                src={
                                  baseUrl.publish_esensi +
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
                                <Item type={local.layout} item={bundle(item)} />
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    )}

                    {local.layout === ItemLayoutEnum.LIST && (
                      <div className="flex flex-col gap-4">
                        {local.bundles.map((item: any) => (
                          <Card
                            key={item.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() =>
                              navigate(`/bundle-update?id=${item.id}`)
                            }
                          >
                            <div className="flex">
                              <Img
                                type={local.layout}
                                check={!!item.cover}
                                src={
                                  baseUrl.publish_esensi +
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
                                  <Item
                                    type={local.layout}
                                    item={bundle(item)}
                                  />
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
                                Bundle
                              </th>
                              <th className="p-2 text-left text-xs font-medium text-gray-600">
                                Jumlah Produk
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
                            {local.bundles.map((item: any, index) => (
                              <tr
                                key={item.id}
                                className={`border-b hover:bg-muted/50 cursor-pointer ${
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }`}
                                onClick={() =>
                                  navigate(`/bundle-update?id=${item.id}`)
                                }
                              >
                                <td className="p-2">
                                  <Img
                                    type={local.layout}
                                    check={!!item.cover}
                                    src={
                                      baseUrl.publish_esensi +
                                      "/" +
                                      item.cover +
                                      "?w=350"
                                    }
                                    alt={item.name}
                                  />
                                </td>
                                <Item type={local.layout} item={bundle(item)} />
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
