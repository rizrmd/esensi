import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { PublishMenuBar } from "@/components/publish/menu-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataPagination } from "@/components/ui/data-pagination";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import type { ProductListAPIResponse } from "backend/api/publish.esensi/product-list";
import type { product } from "shared/models";

export default function ProductListPage() {
  const local = useLocal(
    {
      products: [] as product[],
      loading: true,
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 0,
      error: "",
    },
    async () => {
      const params = new URLSearchParams(location.search);
      local.page = parseInt(params.get("page") || ("1" as string)) as number;
      local.limit = parseInt(params.get("limit") || ("50" as string)) as number;
      await loadData();
    }
  );

  async function loadData() {
    try {
      const res: ProductListAPIResponse = await api.product_list({
        page: local.page,
        limit: local.limit,
      });
      local.products = res.data || [];
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

  if (local.loading) {
    return <AppLoading />;
  }

  return (
    <Protected
      role={["publisher", "author"]}
      fallback={({ missing_role }) => {
        if (
          missing_role.includes("publisher") ||
          missing_role.includes("author")
        ) {
          navigate("/onboarding");
          return <AppLoading />;
        }
      }}
    >
      {({ user }) => {
        return (
          <div className="flex min-h-svh flex-col bg-gray-50">
            <PublishMenuBar />
            {/* Main Content */}
            <main className="flex-1">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {local.error ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 shadow-sm">
                    {local.error}
                  </div>
                ) : null}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="mx-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                      <h1 className="text-2xl font-bold text-gray-800">
                        Daftar Produk Yang Disetujui
                      </h1>
                      <DataPagination 
                        total={local.total}
                        page={local.page}
                        limit={local.limit}
                        totalPages={local.totalPages}
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
                    {local.loading ? (
                      <div>Mengambil data produk...</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {local.products.length === 0 ? (
                          <div className="col-span-full text-center text-muted-foreground">
                            Belum ada produk.
                          </div>
                        ) : (
                          local.products.map((product: any) => (
                            <div
                              key={product.id}
                              className="cursor-pointer"
                              onClick={() =>
                                navigate(`product-detail?id=${product.id}`)
                              }
                            >
                              <Card className="flex flex-col h-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                                <div className="aspect-[3/4] w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl">
                                  {product.cover ? (
                                    <img
                                      src={
                                        baseUrl.publish_esensi +
                                        "/" +
                                        product.cover
                                      }
                                      alt={product.name}
                                      className="object-cover w-full h-full text-center flex items-center justify-center"
                                      onError={(e) => {
                                        const target = e.currentTarget;
                                        target.style.display = "flex";
                                        target.style.alignItems = "center";
                                        target.style.justifyContent = "center";
                                      }}
                                    />
                                  ) : (
                                    <div className="text-gray-400 text-sm flex items-center justify-center w-full h-full">
                                      Tidak ada gambar
                                    </div>
                                  )}
                                </div>
                                <CardHeader className="flex-1">
                                  <CardTitle className="text-lg font-semibold line-clamp-2 mb-2">
                                    {product.name}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="pb-4">
                                  <div className="mb-1 text-sm text-gray-600">
                                    Harga:{" "}
                                    <span className="font-medium text-gray-900">
                                      Rp
                                      {product.real_price?.toLocaleString() ??
                                        "-"}
                                    </span>
                                  </div>
                                  <div className="mb-1 text-sm text-gray-600">
                                    Penulis:{" "}
                                    <span className="font-medium text-gray-900">
                                      {product.author?.name ?? "-"}
                                    </span>
                                  </div>
                                  <div className="mb-1 text-sm text-gray-600">
                                    Status:{" "}
                                    <span className="font-medium text-gray-900">
                                      {product.status}
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        );
      }}
    </Protected>
  );
}
