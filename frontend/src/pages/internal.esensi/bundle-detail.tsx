import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { formatMoney } from "@/components/esensi/format-money";
import { Breadcrumb } from "@/components/ext/bundle/breadcrumb/detail";
import { Error } from "@/components/ext/error";
import { MenuBarInternal } from "@/components/ext/menu-bar/internal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/internal.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { Role, type Bundle } from "backend/lib/types";
import { ArrowLeft, Package } from "lucide-react";

export default () => {
  // Get bundle ID from URL params
  const bundleId = new URLSearchParams(window.location.search).get("id");

  const local = useLocal(
    {
      bundleId: bundleId || "",
      bundleData: undefined as Bundle | undefined,
      loading: true,
      error: "",
    },
    async () => {
      if (!bundleId) {
        local.error = "ID bundle tidak ditemukan";
        local.loading = false;
        local.render();
        return;
      }

      await loadBundleData();
      local.loading = false;
      local.render();
    }
  );

  const loadBundleData = async () => {
    try {
      const resp = await api.bundle_detail({ id: local.bundleId });

      if (resp.success && resp.data) {
        local.bundleData = resp.data;
        local.render();
      } else local.error = resp.message || "Gagal memuat data bundle";
    } catch (error) {
      console.error("Error loading bundle data:", error);
      local.error = "Terjadi kesalahan saat memuat data bundle";
    }
  };

  if (local.loading) return <AppLoading />;

  if (local.error) {
    return (
      <Protected role={[Role.INTERNAL]}>
        <div className="flex min-h-svh flex-col bg-gray-50">
          <MenuBarInternal title="Internal" />
          <main className="flex-1">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
              <Error msg={local.error} />
              <Button
                onClick={() => navigate("/manage-bundle")}
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Bundle
              </Button>
            </div>
          </main>
        </div>
      </Protected>
    );
  }

  if (!local.bundleData) {
    return (
      <Protected role={[Role.INTERNAL]}>
        <div className="flex min-h-svh flex-col bg-gray-50">
          <MenuBarInternal title="Internal" />
          <main className="flex-1">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
              <div className="text-center text-muted-foreground">
                Bundle tidak ditemukan.
              </div>
              <Button
                onClick={() => navigate("/manage-bundle")}
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Bundle
              </Button>
            </div>
          </main>
        </div>
      </Protected>
    );
  }

  return (
    <Protected role={[Role.INTERNAL]}>
      <div className="flex min-h-svh flex-col bg-gray-50">
        <MenuBarInternal title="Internal" />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8">
                <Breadcrumb />
                <div className="flex items-center gap-4 mb-6 mt-6">
                  <Package className="h-8 w-8 text-blue-600" />
                  <h1 className="text-3xl font-bold">
                    {local.bundleData.name}
                  </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Bundle Cover */}
                  <div>
                    {local.bundleData.cover && (
                      <div className="mb-6">
                        <img
                          src={`${baseUrl.internal_esensi}/${local.bundleData.cover}?w=500`}
                          alt={local.bundleData.name}
                          className="w-full max-w-md rounded-lg shadow-md"
                        />
                      </div>
                    )}
                  </div>

                  {/* Bundle Details */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Informasi Bundle</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Penulis:
                          </span>
                          <p className="text-lg">
                            {local.bundleData.author?.name || "-"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Nama:
                          </span>
                          <p className="text-lg">{local.bundleData.name}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Slug:
                          </span>
                          <p className="text-sm text-gray-600">
                            {local.bundleData.slug}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Harga:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-green-600">
                              {formatMoney(
                                local.bundleData.real_price,
                                local.bundleData.currency
                              )}
                            </span>
                            {local.bundleData.strike_price && (
                              <span className="text-lg text-gray-400 line-through">
                                {formatMoney(
                                  local.bundleData.strike_price,
                                  local.bundleData.currency
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Status:
                          </span>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                              local.bundleData.status === "active"
                                ? "bg-green-100 text-green-800"
                                : local.bundleData.status === "draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {local.bundleData.status}
                          </span>
                        </div>
                        {local.bundleData.sku && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">
                              SKU:
                            </span>
                            <p className="text-sm text-gray-600">
                              {local.bundleData.sku}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
                {local.bundleData.desc && (
                  <Card className="mt-8">
                    <CardHeader>
                      <CardTitle>Deskripsi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="text-gray-700 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: local.bundleData.desc,
                        }}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Products in Bundle */}
                {local.bundleData.bundle_product &&
                  local.bundleData.bundle_product.length > 0 && (
                    <Card className="mt-8">
                      <CardHeader>
                        <CardTitle>Produk dalam Bundle</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {local.bundleData.bundle_product.map(
                            (bundleProduct: any) => (
                              <div
                                key={bundleProduct.id}
                                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                              >
                                {bundleProduct.product.cover && (
                                  <img
                                    src={`${baseUrl.internal_esensi}/${bundleProduct.product.cover}?w=200`}
                                    alt={bundleProduct.product.name}
                                    className="w-full h-32 object-cover rounded-md mb-3"
                                  />
                                )}
                                <h4 className="font-medium text-lg mb-2">
                                  {bundleProduct.product.name}
                                </h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p>
                                    <span className="font-medium">
                                      Kuantitas:
                                    </span>{" "}
                                    {bundleProduct.qty}
                                  </p>
                                  <p>
                                    <span className="font-medium">Harga:</span>{" "}
                                    {bundleProduct.product.currency}{" "}
                                    {bundleProduct.product.real_price}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {/* Categories */}
                {local.bundleData.bundle_category &&
                  local.bundleData.bundle_category.length > 0 && (
                    <Card className="mt-8">
                      <CardHeader>
                        <CardTitle>Kategori</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {local.bundleData.bundle_category.map(
                            (bundleCategory: any) => (
                              <span
                                key={bundleCategory.id}
                                className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                              >
                                {bundleCategory.category.name}
                              </span>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Protected>
  );
};
