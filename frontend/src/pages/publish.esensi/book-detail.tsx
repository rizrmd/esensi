import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { PublishMenuBar } from "@/components/publish/menu-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import type { BookDetailAPIResponse } from "backend/api/publish.esensi/book-detail";
import { ArrowLeft, PlusCircle } from "lucide-react";
import type { author, book } from "shared/models";

export default function BookDetailPage() {
  const local = useLocal(
    {
      book: null as (book & { author: author | null }) | null,
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
        const res: BookDetailAPIResponse = await api.book_detail({ id });
        if (!res.data) {
          local.error = "Produk tidak ditemukan.";
        } else {
          local.book = res.data;
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
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => navigate("/manage-book")}
                        className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1.5"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Kembali ke Daftar
                      </Button>
                      <h1 className="text-2xl font-bold">Detail Produk</h1>
                    </div>
                    <Button
                      onClick={() => navigate("/book-create")}
                      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md px-3 py-1.5"
                      variant="ghost"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Tambah Buku
                    </Button>
                  </div>
                  {local.error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 shadow-sm">
                      {local.error}
                    </div>
                  ) : local.book ? (
                    <Card className="shadow-md border border-gray-200">
                      <div className="w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl">
                        {local.book.cover ? (
                          <img
                            src={
                              baseUrl.publish_esensi + "/" + local.book.cover
                            }
                            alt={local.book.name}
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
                          {local.book.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2 text-sm text-gray-600">
                          ID Produk:{" "}
                          <span className="font-medium text-gray-900">
                            {local.book.id}
                          </span>
                        </div>
                        <div className="mb-2 text-sm text-gray-600">
                          Nama:{" "}
                          <span className="font-medium text-gray-900">
                            {local.book.name}
                          </span>
                        </div>
                        <div className="mb-2 text-sm text-gray-600">
                          Slug:{" "}
                          <span className="font-medium text-gray-900">
                            {local.book.slug}
                          </span>
                        </div>
                        <div className="mb-2 text-sm text-gray-600">
                          Alias:{" "}
                          <span className="font-medium text-gray-900">
                            {local.book.alias ?? "-"}
                          </span>
                        </div>
                        <div className="mb-2 text-sm text-gray-600">
                          Harga Coret:{" "}
                          <span className="font-medium text-gray-900">
                            {local.book.strike_price
                              ? `Rp${local.book.strike_price.toLocaleString()}`
                              : "-"}
                          </span>
                        </div>
                        <div className="mb-2 text-sm text-gray-600">
                          Harga:{" "}
                          <span className="font-medium text-gray-900">
                            {local.book.real_price
                              ? `Rp${local.book.real_price.toLocaleString()}`
                              : "-"}
                          </span>
                        </div>
                        <div className="mb-2 text-sm text-gray-600">
                          Penulis:{" "}
                          <span className="font-medium text-gray-900">
                            {local.book.author?.name ?? "-"}
                          </span>
                        </div>
                        <div className="mb-2 text-sm text-gray-600">
                          Status:{" "}
                          <span className="font-medium text-gray-900">
                            {local.book.status}
                          </span>
                        </div>
                        <div className="mb-2 text-sm text-gray-600">
                          Mata Uang:{" "}
                          <span className="font-medium text-gray-900">
                            {local.book.currency}
                          </span>
                        </div>
                        <div className="mb-2 text-sm text-gray-600">
                          SKU:{" "}
                          <span className="font-medium text-gray-900">
                            {local.book.sku ?? "-"}
                          </span>
                        </div>
                        <div className="mb-2 text-sm text-gray-600">
                          Tanggal Terbit:{" "}
                          <span className="font-medium text-gray-900">
                            {local.book.published_date
                              ? new Date(
                                  local.book.published_date
                                ).toLocaleDateString("id-ID")
                              : "-"}
                          </span>
                        </div>
                        <div className="mb-2 text-sm text-gray-600">
                          Fisik:{" "}
                          <span className="font-medium text-gray-900">
                            {local.book.is_physical ? "Ya" : "Tidak"}
                          </span>
                        </div>
                        <div className="mb-2 text-sm text-gray-600">
                          Minimal Preorder:{" "}
                          <span className="font-medium text-gray-900">
                            {local.book.preorder_min_qty ?? "-"}
                          </span>
                        </div>
                        <div className="mb-2 text-sm text-gray-600">
                          Tipe Konten:{" "}
                          <span className="font-medium text-gray-900">
                            {local.book.content_type ?? "-"}
                          </span>
                        </div>
                        <div className="mb-2 text-sm text-gray-600">
                          Deskripsi:{" "}
                          {local.book.desc ? (
                            <div 
                              className="font-medium text-gray-900 mt-2 p-3 border border-gray-100 rounded-md"
                              dangerouslySetInnerHTML={{ __html: local.book.desc }}
                            />
                          ) : (
                            <span className="font-medium text-gray-900">-</span>
                          )}
                        </div>
                        <div className="mb-2 text-sm text-gray-600">
                          Info Tambahan:{" "}
                          <span className="font-medium text-gray-900">
                            {local.book.info
                              ? JSON.stringify(local.book.info)
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
      )}
    </Protected>
  );
}
