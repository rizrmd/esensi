import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { InternalMenuBar } from "@/components/internal/menu-bar";
import { LayoutToggle } from "@/components/publish/layout-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataPagination } from "@/components/ui/data-pagination";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { ItemLayout } from "@/lib/utils";
import { Role, type Book } from "backend/api/types";
import { ChevronRight } from "lucide-react";

export default function BookListPage() {
  const local = useLocal(
    {
      books: [] as Book[],
      loading: true,
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 0,
      error: "",
      layout: ItemLayout.GRID,
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
        <InternalMenuBar />

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
                  <span className="text-gray-800 font-medium">Daftar Buku</span>
                </nav>

                {/* Divider line */}
                <div className="border-b border-gray-200 mb-6"></div>

                <div className="flex justify-between items-start mb-8 gap-4">
                  <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                      Daftar Buku
                    </h1>
                  </div>
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
                ) : (
                  <>
                    {local.books.length === 0 ? (
                      <div className="text-center text-muted-foreground">
                        Belum ada buku.
                      </div>
                    ) : (
                      <>
                        {local.layout === "grid" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {local.books.map((book: Book) => (
                              <div
                                key={book.id}
                                className="cursor-pointer"
                                onClick={() =>
                                  navigate(`book-step?id=${book.id}`)
                                }
                              >
                                <Card className="flex flex-col h-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                                  <div className="aspect-[3/4] w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl">
                                    {book.cover ? (
                                      <img
                                        src={
                                          baseUrl.internal_esensi +
                                          "/" +
                                          book.cover +
                                          "?w=350"
                                        }
                                        alt={book.name}
                                        className="object-cover w-full h-full text-center flex items-center justify-center"
                                        onError={(e) => {
                                          const target = e.currentTarget;
                                          target.style.display = "flex";
                                          target.style.alignItems = "center";
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
                                      {book.name}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="pb-4">
                                    <div className="mb-1 text-sm text-gray-600">
                                      Harga:{" "}
                                      <span className="font-medium text-gray-900">
                                        Rp
                                        {book.submitted_price?.toLocaleString() ??
                                          "-"}
                                      </span>
                                    </div>
                                    <div className="mb-1 text-sm text-gray-600">
                                      Penulis:{" "}
                                      <span className="font-medium text-gray-900">
                                        {book.author?.name ?? "-"}
                                      </span>
                                    </div>
                                    <div className="mb-1 text-sm text-gray-600">
                                      Status:{" "}
                                      <span className="font-medium text-gray-900">
                                        {book.status}
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
                            {local.books.map((book: Book) => (
                              <Card
                                key={book.id}
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() =>
                                  navigate(`book-step?id=${book.id}`)
                                }
                              >
                                <div className="flex">
                                  <div className="w-40 h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {book.cover ? (
                                      <img
                                        src={
                                          baseUrl.internal_esensi +
                                          "/" +
                                          book.cover +
                                          "?w=350"
                                        }
                                        alt={book.name}
                                        className="object-cover w-full h-full"
                                        onError={(e) => {
                                          const target = e.currentTarget;
                                          target.style.display = "flex";
                                          target.style.alignItems = "center";
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
                                      {book.name}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      <div className="text-sm text-gray-600">
                                        Harga:{" "}
                                        <span className="font-medium text-gray-900">
                                          Rp
                                          {book.submitted_price?.toLocaleString() ??
                                            "-"}
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        Penulis:{" "}
                                        <span className="font-medium text-gray-900">
                                          {book.author?.name ?? "-"}
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        Status:{" "}
                                        <span className="font-medium text-gray-900">
                                          {book.status}
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
                                {local.books.map((book: Book, index) => (
                                  <tr
                                    key={book.id}
                                    className={`border-b hover:bg-muted/50 cursor-pointer ${
                                      index % 2 === 0
                                        ? "bg-white"
                                        : "bg-gray-50"
                                    }`}
                                    onClick={() =>
                                      navigate(`book-step?id=${book.id}`)
                                    }
                                  >
                                    <td className="p-2">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                                          {book.cover ? (
                                            <img
                                              src={
                                                baseUrl.internal_esensi +
                                                "/" +
                                                book.cover +
                                                "?w=350"
                                              }
                                              alt={book.name}
                                              className="object-cover w-full h-full"
                                            />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                              No img
                                            </div>
                                          )}
                                        </div>
                                        <span className="font-medium text-sm">
                                          {book.name}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="p-2 text-sm">
                                      {book.author?.name ?? "-"}
                                    </td>
                                    <td className="p-2 text-sm">
                                      Rp
                                      {book.submitted_price?.toLocaleString() ??
                                        "-"}
                                    </td>
                                    <td className="p-2 text-sm">
                                      {book.status}
                                    </td>
                                  </tr>
                                ))}
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
    </Protected>
  );
}
