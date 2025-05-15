import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { PublishMenuBar } from "@/components/publish/menu-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import type { product } from "shared/models";
import { baseUrl } from "@/lib/gen/base-url";

export default function ProductListPage() {
  const local = useLocal(
    { products: [] as product[], loading: true, page: 1, limit: 50, error: "" },
    async () => {
      const params = new URLSearchParams(location.search);
      local.page = parseInt(params.get("page") || ("1" as string)) as number;
      local.limit = parseInt(params.get("limit") || ("50" as string)) as number;
      try {
        const res = await api.product_list({
          page: local.page,
          limit: local.limit,
        });
        local.products = res.data || [];
      } catch (error) {
        local.error = "Terjadi kesalahan saat memuat data.";
      } finally {
        local.loading = false;
        local.render();
      }
    }
  );

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
            <PublishMenuBar title="Dasbor" />
            {/* Main Content */}
            <main className="flex-1">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {local.error ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 shadow-sm">
                    {local.error}
                  </div>
                ) : null}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="container mx-8 py-8">
                    <h1 className="text-2xl font-bold mb-6">Daftar Produk Yang Disetujui</h1>
                    {local.loading ? (
                      <div>Mengambil data produk yang disetujui...</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {local.products.length === 0 ? (
                          <div className="col-span-full text-center text-muted-foreground">
                            Belum ada produk yang disetujui.
                          </div>
                        ) : (
                          local.products.map((product: any) => (
                            <Card
                              key={product.id}
                              className="flex flex-col h-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                            >
                              <div className="aspect-[3/4] w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl">
                                {product.cover ? (
                                  <img
                                    src={baseUrl.publish_esensi + product.cover}
                                    alt={product.name}
                                    className="object-cover w-full h-full"
                                    style={{ maxHeight: 260 }}
                                  />
                                ) : (
                                  <div className="text-gray-400 text-sm">
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
