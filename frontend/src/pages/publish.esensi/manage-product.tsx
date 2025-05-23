import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { LayoutToggle } from "@/components/publish/layout-toggle";
import { PublishMenuBar } from "@/components/publish/menu-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataPagination } from "@/components/ui/data-pagination";
import {
  betterAuth,
  type AuthClientGetSessionAPIResponse,
  type User,
} from "@/lib/better-auth";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import type { Product } from "backend/api/types";
import { ChevronRight } from "lucide-react";

export default function ProductListPage() {
  const local = useLocal(
    {
      user: null as Partial<User> | null,
      products: [] as Product[],
      loading: true,
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 0,
      error: "",
      layout: "grid", // "grid" for Icon View, "list" for List View, "compact" for Compact List
    },
    async () => {
      const params = new URLSearchParams(location.search);
      local.page = parseInt(params.get("page") || ("1" as string)) as number;
      local.limit = parseInt(params.get("limit") || ("50" as string)) as number;

      const session: AuthClientGetSessionAPIResponse =
        await betterAuth.getSession();
      if (!session.data?.user) {
        navigate("/");
        return;
      }
      local.user = session.data.user;

      await loadData();
    }
  );

  async function loadData() {
    try {
      const res = await api.product_list({
        page: local.page,
        limit: local.limit,
        id_author: local.user?.idAuthor!,
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
        return null;
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
                    {/* Breadcrumb Navigation */}
                    <nav className="flex items-center text-sm text-gray-600 mb-4">
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
                      >
                        Beranda
                      </button>
                      <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                      <span className="text-gray-800 font-medium">
                        Daftar Produk
                      </span>
                    </nav>

                    {/* Divider line */}
                    <div className="border-b border-gray-200 mb-6"></div>

                    <div className="flex justify-between items-start mb-8 gap-4">
                      <h1 className="text-2xl font-bold text-gray-800">
                        Daftar Produk
                      </h1>
                      <div className="flex flex-col gap-3 items-end">
                        <div className="flex items-center gap-4">
                          <LayoutToggle
                            layout={local.layout}
                            onLayoutChange={(value) => {
                              local.layout = value;
                              local.render();
                            }}
                          />
                        </div>
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
                    </div>
                    {local.loading ? (
                      <div>Mengambil data produk...</div>
                    ) : (
                      <>
                        {local.products.length === 0 ? (
                          <div className="text-center text-muted-foreground">
                            Belum ada produk.
                          </div>
                        ) : (
                          <>
                            {local.layout === "grid" && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                {local.products.map((product: Product) => (
                                  <div
                                    key={product.id}
                                    className="cursor-pointer"
                                    onClick={() =>
                                      navigate(
                                        `product-detail?id=${product.id}`
                                      )
                                    }
                                  >
                                    <Card className="flex flex-col h-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                                      <div className="aspect-[3/4] w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl">
                                        {product.cover ? (
                                          <img
                                            src={
                                              baseUrl.publish_esensi +
                                              "/" +
                                              product.cover +
                                              "?w=350"
                                            }
                                            alt={product.name}
                                            className="object-cover w-full h-full text-center flex items-center justify-center"
                                            onError={(e) => {
                                              const target = e.currentTarget;
                                              target.style.display = "flex";
                                              target.style.alignItems =
                                                "center";
                                              target.style.justifyContent =
                                                "center";
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
                                ))}
                              </div>
                            )}

                            {local.layout === "list" && (
                              <div className="flex flex-col gap-4">
                                {local.products.map((product: Product) => (
                                  <Card
                                    key={product.id}
                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() =>
                                      navigate(
                                        `product-detail?id=${product.id}`
                                      )
                                    }
                                  >
                                    <div className="flex">
                                      <div className="w-40 h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                                        {product.cover ? (
                                          <img
                                            src={
                                              baseUrl.publish_esensi +
                                              "/" +
                                              product.cover +
                                              "?w=350"
                                            }
                                            alt={product.name}
                                            className="object-cover w-full h-full"
                                            onError={(e) => {
                                              const target = e.currentTarget;
                                              target.style.display = "flex";
                                              target.style.alignItems =
                                                "center";
                                              target.style.justifyContent =
                                                "center";
                                            }}
                                          />
                                        ) : (
                                          <div className="text-gray-400 text-sm flex items-center justify-center w-full h-full">
                                            Tidak ada gambar
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 p-4">
                                        <h3 className="text-lg font-semibold mb-2">
                                          {product.name}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                          <div className="text-sm text-gray-600">
                                            Harga:{" "}
                                            <span className="font-medium text-gray-900">
                                              Rp
                                              {product.real_price?.toLocaleString() ??
                                                "-"}
                                            </span>
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            Penulis:{" "}
                                            <span className="font-medium text-gray-900">
                                              {product.author?.name ?? "-"}
                                            </span>
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            Status:{" "}
                                            <span className="font-medium text-gray-900">
                                              {product.status}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            )}

                            {local.layout === "compact" && (
                              <div className="border rounded-md overflow-hidden">
                                <table className="w-full">
                                  <thead>
                                    <tr className="border-b bg-muted/50">
                                      <th className="p-2 text-left text-xs font-medium text-gray-600">
                                        Produk
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
                                    {local.products.map(
                                      (product: Product, index) => (
                                        <tr
                                          key={product.id}
                                          className={`border-b hover:bg-muted/50 cursor-pointer ${
                                            index % 2 === 0
                                              ? "bg-white"
                                              : "bg-gray-50"
                                          }`}
                                          onClick={() =>
                                            navigate(
                                              `product-detail?id=${product.id}`
                                            )
                                          }
                                        >
                                          <td className="p-2">
                                            <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                                                {product.cover ? (
                                                  <img
                                                    src={
                                                      baseUrl.publish_esensi +
                                                      "/" +
                                                      product.cover +
                                                      "?w=350"
                                                    }
                                                    alt={product.name}
                                                    className="object-cover w-full h-full"
                                                  />
                                                ) : (
                                                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                    No img
                                                  </div>
                                                )}
                                              </div>
                                              <span className="font-medium text-sm">
                                                {product.name}
                                              </span>
                                            </div>
                                          </td>
                                          <td className="p-2 text-sm">
                                            {product.author?.name ?? "-"}
                                          </td>
                                          <td className="p-2 text-sm">
                                            Rp
                                            {product.real_price?.toLocaleString() ??
                                              "-"}
                                          </td>
                                          <td className="p-2 text-sm">
                                            {product.status}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </>
                        )}
                      </>
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
