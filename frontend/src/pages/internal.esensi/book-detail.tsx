import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { Breadcrumb } from "@/components/ext/book/breadcrumb/detail";
import { BookChangesLog } from "@/components/ext/book/changes-log";
import { Error } from "@/components/ext/error";
import { MenuBarInternal } from "@/components/ext/menu-bar/internal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import {
  Role,
  type Book,
  type BookChangesLog as BookChangesLogType,
} from "backend/api/types";

export default function BookDetailPage() {
  const local = useLocal(
    {
      book: null as Book | null,
      loading: true,
      error: "",
    },
    async () => {
      const params = new URLSearchParams(location.search);
      const id = params.get("id");
      if (!id) {
        local.error = "Buku tidak ditemukan.";
        local.loading = false;
        local.render();
        return;
      }
      try {
        const res = await api.book_detail({ id });
        if (!res.data) local.error = "Buku tidak ditemukan.";
        else local.book = res.data;
      } catch (error) {
        local.error = "Terjadi kesalahan saat memuat data buku.";
      } finally {
        local.loading = false;
        local.render();
      }
    }
  );

  if (local.loading) return <AppLoading />;

  return (
    <Protected role={[Role.INTERNAL]}>
      <div className="flex min-h-svh flex-col bg-gray-50">
        <MenuBarInternal />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <Breadcrumb id={local.book?.id!} />
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Detil Buku</h1>
                  </div>
                </div>

                <Error msg={local.error}>
                  {local.book && (
                    <Card className="shadow-md border border-gray-200">
                      <div className="w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl">
                        {local.book.cover ? (
                          <img
                            src={
                              baseUrl.internal_esensi + "/" + local.book.cover
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
                          Harga:{" "}
                          <span className="font-medium text-gray-900">
                            {local.book.submitted_price
                              ? `Rp${local.book.submitted_price.toLocaleString()}`
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
                            {!local.book.sku ? "-" : local.book.sku}
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
                              dangerouslySetInnerHTML={{
                                __html: local.book.desc,
                              }}
                            />
                          ) : (
                            <span className="font-medium text-gray-900">-</span>
                          )}
                        </div>
                        {Object.keys(local.book.info as Record<string, any>)
                          .length > 0 && (
                          <div className="mb-2 text-sm text-gray-600">
                            Info Tambahan:{" "}
                            <span className="font-medium text-gray-900">
                              {local.book.info
                                ? JSON.stringify(local.book.info)
                                : "-"}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </Error>

                <BookChangesLog
                  book={local.book}
                  onReloadData={(log: BookChangesLogType[] | undefined) => {
                    local.book!.book_changes_log = log!;
                    local.render();
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </Protected>
  );
}
