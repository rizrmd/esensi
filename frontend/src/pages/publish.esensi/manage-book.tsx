import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { PublishMenuBar } from "@/components/publish/menu-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataPagination } from "@/components/ui/data-pagination";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import type { BookListAPIResponse } from "backend/api/publish.esensi/book-list";
import { Grid, List, LayoutGrid, PlusCircle } from "lucide-react";
import type { book } from "shared/models";

export default function BookListPage() {
  const local = useLocal(
    {
      books: [] as book[],
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
      await loadData();
    }
  );

  async function loadData() {
    try {
      const res: BookListAPIResponse = await api.book_list({
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
                      <div className="flex flex-row items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                          Daftar Buku Yang Disetujui
                        </h1>
                        <Button
                          onClick={() => navigate("/book-create")}
                          className="flex items-center gap-2"
                          variant="default"
                        >
                          <PlusCircle className="h-5 w-5" />
                          <span>Tambah Buku</span>
                        </Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <ToggleGroup 
                          type="single" 
                          value={local.layout} 
                          onValueChange={(value) => {
                            if (value) {
                              local.layout = value;
                              local.render();
                            }
                          }}
                          className="border rounded-md"
                        >
                          <ToggleGroupItem value="grid" aria-label="Tampilan Ikon">
                            <Grid className="h-4 w-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem value="list" aria-label="Tampilan Daftar">
                            <LayoutGrid className="h-4 w-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem value="compact" aria-label="Tampilan Daftar Ringkas">
                            <List className="h-4 w-4" />
                          </ToggleGroupItem>
                        </ToggleGroup>
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
                                {local.books.map((book: any) => (
                                  <div
                                    key={book.id}
                                    className="cursor-pointer"
                                    onClick={() =>
                                      navigate(`book-detail?id=${book.id}`)
                                    }
                                  >
                                    <Card className="flex flex-col h-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                                      <div className="aspect-[3/4] w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl">
                                        {book.cover ? (
                                          <img
                                            src={
                                              baseUrl.publish_esensi +
                                              "/" +
                                              book.cover
                                            }
                                            alt={book.name}
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
                                          {book.name}
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="pb-4">
                                        <div className="mb-1 text-sm text-gray-600">
                                          Harga:{" "}
                                          <span className="font-medium text-gray-900">
                                            Rp
                                            {book.real_price?.toLocaleString() ?? "-"}
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
                                {local.books.map((book: any) => (
                                  <Card 
                                    key={book.id}
                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => navigate(`book-detail?id=${book.id}`)}
                                  >
                                    <div className="flex">
                                      <div className="w-40 h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                                        {book.cover ? (
                                          <img
                                            src={baseUrl.publish_esensi + "/" + book.cover}
                                            alt={book.name}
                                            className="object-cover w-full h-full"
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
                                      <div className="flex-1 p-4">
                                        <h3 className="text-lg font-semibold mb-2">{book.name}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                          <div className="text-sm text-gray-600">
                                            Harga: <span className="font-medium text-gray-900">Rp{book.real_price?.toLocaleString() ?? "-"}</span>
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            Penulis: <span className="font-medium text-gray-900">{book.author?.name ?? "-"}</span>
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            Status: <span className="font-medium text-gray-900">{book.status}</span>
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
                                      <th className="p-2 text-left text-xs font-medium text-gray-600">Buku</th>
                                      <th className="p-2 text-left text-xs font-medium text-gray-600">Penulis</th>
                                      <th className="p-2 text-left text-xs font-medium text-gray-600">Harga</th>
                                      <th className="p-2 text-left text-xs font-medium text-gray-600">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {local.books.map((book: any, index) => (
                                      <tr 
                                        key={book.id}
                                        className={`border-b hover:bg-muted/50 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                        onClick={() => navigate(`book-detail?id=${book.id}`)}
                                      >
                                        <td className="p-2">
                                          <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                                              {book.cover ? (
                                                <img
                                                  src={baseUrl.publish_esensi + "/" + book.cover}
                                                  alt={book.name}
                                                  className="object-cover w-full h-full"
                                                />
                                              ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                  No img
                                                </div>
                                              )}
                                            </div>
                                            <span className="font-medium text-sm">{book.name}</span>
                                          </div>
                                        </td>
                                        <td className="p-2 text-sm">{book.author?.name ?? "-"}</td>
                                        <td className="p-2 text-sm">Rp{book.real_price?.toLocaleString() ?? "-"}</td>
                                        <td className="p-2 text-sm">{book.status}</td>
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
        );
      }}
    </Protected>
  );
}
