import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
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
        if (!res.data) {
          local.error = "Produk tidak ditemukan.";
        } else {
          local.product = res.data;
        }
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
      {() => (
        <div className="flex min-h-svh flex-col bg-gray-50">
          <main className="flex-1 flex items-center justify-center">
            <div className="max-w-xl w-full mx-auto px-4 py-8">
              {local.error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 shadow-sm">
                  {local.error}
                </div>
              ) : local.product ? (
                <Card className="shadow-md border border-gray-200">
                  <div className="aspect-[3/4] w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl">
                    {local.product.cover ? (
                      <img
                        src={baseUrl.publish_esensi + local.product.cover}
                        alt={local.product.name}
                        className="object-cover w-full h-full"
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
                      Harga:{" "}
                      <span className="font-medium text-gray-900">
                        Rp{local.product.real_price?.toLocaleString() ?? "-"}
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
                      Deskripsi:{" "}
                      <span className="font-medium text-gray-900">
                        {local.product.desc ?? "-"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </main>
        </div>
      )}
    </Protected>
  );
}
