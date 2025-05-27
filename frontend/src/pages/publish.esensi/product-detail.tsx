import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { PublishMenuBar } from "@/components/publish/menu-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { Role } from "backend/api/types";
import { ChevronRight } from "lucide-react";
import type { author, product } from "shared/models";

export default function ProductDetailPage() {
  const local = useLocal(
    {
      product: null as (product & { author: author | null }) | null,
      loading: true,
      error: "",
    },
    async () => {
      const params = new URLSearchParams(location.search);
      const id = params.get("id");
      if (!id) {
        local.error = "Produk tidak ditemukan.";
        local.loading = false;
        local.render();
        return;
      }
      try {
        const res = await api.product_detail({ id });
        if (!res.data) local.error = "Produk tidak ditemukan.";
        else local.product = res.data;
      } catch (error) {
        local.error = "Terjadi kesalahan saat memuat data produk.";
      } finally {
        local.loading = false;
        local.render();
      }
    }
  );

  if (local.loading) return <AppLoading />;

  return (
    <Protected
      role={[Role.AUTHOR, Role.PUBLISHER]}
      fallback={({ missing_role }) => {
        if (
          missing_role.some((x) => x === Role.AUTHOR || x === Role.PUBLISHER)
        ) {
          navigate("/onboarding");
          return <AppLoading />;
        }
        return null;
      }}
    >
      <div className="flex min-h-svh flex-col bg-gray-50">
        <PublishMenuBar />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {local.error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 shadow-sm">
                {local.error}
              </div>
            ) : null}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center text-sm text-gray-600 mb-4">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
                  >
                    Beranda
                  </button>
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                  <button
                    onClick={() => navigate("/manage-product")}
                    className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
                  >
                    Daftar Produk
                  </button>
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                  <span className="text-gray-800 font-medium">
                    Detil Produk
                  </span>
                </nav>

                {/* Divider line */}
                <div className="border-b border-gray-200 mb-6"></div>

                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Detil Produk</h1>
                  </div>
                </div>
                {local.error ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 shadow-sm">
                    {local.error}
                  </div>
                ) : local.product ? (
                  <Card className="shadow-md border border-gray-200">
                    <div className="w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl">
                      {local.product.cover ? (
                        <img
                          src={
                            baseUrl.publish_esensi + "/" + local.product.cover
                          }
                          alt={local.product.name}
                          className="mx-auto object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-sm">
                          Tidak ada gambar
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold mb-2">
                        {local.product.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 text-sm text-gray-600">
                        ID Produk:{" "}
                        <span className="font-medium text-gray-900">
                          {local.product.id}
                        </span>
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        Nama:{" "}
                        <span className="font-medium text-gray-900">
                          {local.product.name}
                        </span>
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        Slug:{" "}
                        <span className="font-medium text-gray-900">
                          {local.product.slug}
                        </span>
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        Alias:{" "}
                        <span className="font-medium text-gray-900">
                          {local.product.alias ?? "-"}
                        </span>
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        Harga Coret:{" "}
                        <span className="font-medium text-gray-900">
                          {local.product.strike_price
                            ? `Rp${local.product.strike_price.toLocaleString()}`
                            : "-"}
                        </span>
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        Harga:{" "}
                        <span className="font-medium text-gray-900">
                          {local.product.real_price
                            ? `Rp${local.product.real_price.toLocaleString()}`
                            : "-"}
                        </span>
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        Penulis:{" "}
                        <span className="font-medium text-gray-900">
                          {local.product.author?.name ?? "-"}
                        </span>
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        Status:{" "}
                        <span className="font-medium text-gray-900">
                          {local.product.status}
                        </span>
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        Mata Uang:{" "}
                        <span className="font-medium text-gray-900">
                          {local.product.currency}
                        </span>
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        SKU:{" "}
                        <span className="font-medium text-gray-900">
                          {local.product.sku ?? "-"}
                        </span>
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        Tanggal Terbit:{" "}
                        <span className="font-medium text-gray-900">
                          {local.product.published_date
                            ? new Date(
                                local.product.published_date
                              ).toLocaleDateString("id-ID")
                            : "-"}
                        </span>
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        Fisik:{" "}
                        <span className="font-medium text-gray-900">
                          {local.product.is_physical ? "Ya" : "Tidak"}
                        </span>
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        Minimal Preorder:{" "}
                        <span className="font-medium text-gray-900">
                          {local.product.preorder_min_qty ?? "-"}
                        </span>
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        Tipe Konten:{" "}
                        <span className="font-medium text-gray-900">
                          {local.product.content_type ?? "-"}
                        </span>
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        Deskripsi:{" "}
                        {local.product.desc ? (
                          <div
                            className="font-medium text-gray-900 mt-2 p-3 border border-gray-100 rounded-md"
                            dangerouslySetInnerHTML={{
                              __html: local.product.desc,
                            }}
                          />
                        ) : (
                          <span className="font-medium text-gray-900">-</span>
                        )}
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        Info Tambahan:{" "}
                        <span className="font-medium text-gray-900">
                          {local.product.info
                            ? JSON.stringify(local.product.info)
                            : "-"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Protected>
  );
}
