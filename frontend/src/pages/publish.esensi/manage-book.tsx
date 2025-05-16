import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { PublishMenuBar } from "@/components/publish/menu-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { PlusCircle } from "lucide-react";
import type { book } from "shared/models";

export default function BookListPage() {
  const local = useLocal(
    { books: [] as book[], loading: true, page: 1, limit: 50, error: "" },
    async () => {
      const params = new URLSearchParams(location.search);
      local.page = parseInt(params.get("page") || ("1" as string)) as number;
      local.limit = parseInt(params.get("limit") || ("50" as string)) as number;
      try {
        const res = await api.book_list({
          page: local.page,
          limit: local.limit,
        });
        local.books = res.data || [];
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
            <PublishMenuBar title="Daftar Buku Yang Belum Disetujui" />
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
                    <div className="flex justify-between items-center mb-6">
                      <h1 className="text-2xl font-bold">
                        Daftar Buku Yang Belum Disetujui
                      </h1>
                      <Button
                        onClick={() => navigate("/book-create")}
                        className="flex items-center gap-2"
                      >
                        <PlusCircle className="h-5 w-5" />
                        <span>Tambah Buku</span>
                      </Button>
                    </div>
                    {local.loading ? (
                      <div>Mengambil data buku...</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {local.books.length === 0 ? (
                          <div className="col-span-full text-center text-muted-foreground">
                            Belum ada buku
                          </div>
                        ) : (
                          local.books.map((book: any) => (
                            <Card
                              key={book.id}
                              className="flex flex-col h-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                            >
                              <div className="aspect-[3/4] w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl">
                                {book.cover ? (
                                  <img
                                    src={
                                      baseUrl.publish_esensi + "/" + book.cover
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
