import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { PublishMenuBar } from "@/components/publish/menu-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import type { Book, BookChangesLog } from "backend/api/types";
import { ChevronDown, ChevronRight, ChevronUp, History } from "lucide-react";

export default function BookDetailPage() {
  const local = useLocal(
    {
      book: null as Book | null,
      loading: true,
      error: "",
      expandedLogs: {} as Record<string, boolean>,
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
        if (!res.data) {
          local.error = "Buku tidak ditemukan.";
        } else {
          local.book = res.data;
          console.log("Changes log list:", res.data.book_changes_log);
        }
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
                      onClick={() => navigate("/manage-book")}
                      className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
                    >
                      Daftar Buku
                    </button>
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                    <button
                      onClick={() =>
                        navigate("/book-step?id=" + local.book?.id)
                      }
                      className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
                    >
                      Proses Buku
                    </button>
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                    <span className="text-gray-800 font-medium">
                      Detil Buku
                    </span>
                  </nav>

                  {/* Divider line */}
                  <div className="border-b border-gray-200 mb-6"></div>

                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <h1 className="text-2xl font-bold">Detil Buku</h1>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      {local.book && (
                        <Button
                          onClick={() =>
                            navigate(`/book-update?id=${local.book?.id}`)
                          }
                          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-3 py-1.5"
                          variant="default"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Buku
                        </Button>
                      )}
                      <Button
                        onClick={() => navigate("/book-create")}
                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md px-3 py-1.5"
                        variant="default"
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Tambah Buku
                      </Button>
                    </div> */}
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
                          ID Buku:{" "}
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
                              dangerouslySetInnerHTML={{
                                __html: local.book.desc,
                              }}
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

                  {/* Changes Log Section */}
                  {local.book?.book_changes_log &&
                    local.book.book_changes_log.length > 0 && (
                      <div className="mt-8">
                        <div className="flex items-center mb-4">
                          <History className="h-5 w-5 mr-2 text-indigo-500" />
                          <h2 className="text-xl font-bold">
                            Riwayat Perubahan
                          </h2>
                        </div>

                        {local.book.book_changes_log.map(
                          (log: BookChangesLog) => (
                            <Card
                              key={log.hash_value}
                              className="mb-4 overflow-hidden border border-gray-200"
                            >
                              <CardHeader className="bg-gray-50 py-3 px-4">
                                <div
                                  className="flex justify-between items-center cursor-pointer"
                                  onClick={() => {
                                    local.expandedLogs[log.hash_value!] =
                                      !local.expandedLogs[log.hash_value!];
                                    local.render();
                                  }}
                                >
                                  <div>
                                    <p className="font-medium text-sm">
                                      Perubahan pada{" "}
                                      {new Date(
                                        log.created_at
                                      ).toLocaleDateString("id-ID", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                  </div>
                                  {local.expandedLogs[log.hash_value!] ? (
                                    <ChevronUp className="h-5 w-5 text-gray-500" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                  )}
                                </div>
                              </CardHeader>

                              {local.expandedLogs[log.hash_value!] && (
                                <CardContent className="p-0">
                                  <div className="grid grid-cols-2 divide-x divide-gray-200">
                                    <div className="p-4">
                                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                        Nilai Sebelumnya
                                      </h3>
                                      {/* {Object.entries(
                                        log.changes?['oldFields']
                                      ).map(([key, value]) => (
                                        <div
                                          key={`old-${key}`}
                                          className="mb-3 pb-3 border-b border-gray-100 last:border-b-0"
                                        >
                                          <p className="text-xs font-medium text-gray-500 mb-1">
                                            {key}
                                          </p>
                                          <p className="text-sm whitespace-pre-wrap break-words font-medium">
                                            {value === null ||
                                            value === undefined ? (
                                              <span className="text-gray-400 italic">
                                                Kosong
                                              </span>
                                            ) : typeof value === "object" ? (
                                              JSON.stringify(value, null, 2)
                                            ) : (
                                              String(value)
                                            )}
                                          </p>
                                        </div>
                                      ))} */}
                                      {/* {Object.keys(log.changes?['oldFields'])
                                        .length === 0 && (
                                        <p className="text-sm text-gray-500 italic">
                                          Tidak ada data sebelumnya
                                        </p>
                                      )} */}
                                    </div>

                                    <div className="p-4">
                                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                        Nilai Baru
                                      </h3>
                                      {/* {Object.entries(
                                        log.changes?['newFields']
                                      ).map(([key, value]) => (
                                        <div
                                          key={`new-${key}`}
                                          className="mb-3 pb-3 border-b border-gray-100 last:border-b-0"
                                        >
                                          <p className="text-xs font-medium text-gray-500 mb-1">
                                            {key}
                                          </p>
                                          <p className="text-sm whitespace-pre-wrap break-words font-medium">
                                            {value === null ||
                                            value === undefined ? (
                                              <span className="text-gray-400 italic">
                                                Kosong
                                              </span>
                                            ) : typeof value === "object" ? (
                                              JSON.stringify(value, null, 2)
                                            ) : (
                                              String(value)
                                            )}
                                          </p>
                                        </div>
                                      ))}
                                      {Object.keys(log.changes?['newFields'])
                                        .length === 0 && (
                                        <p className="text-sm text-gray-500 italic">
                                          Tidak ada data baru
                                        </p>
                                      )} */}
                                    </div>
                                  </div>
                                </CardContent>
                              )}
                            </Card>
                          )
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </Protected>
  );
}
