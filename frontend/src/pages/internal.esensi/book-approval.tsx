import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { PublishMenuBar } from "@/components/publish/menu-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataPagination } from "@/components/ui/data-pagination";
import { Alert } from "@/components/ui/global-alert";
import {
  betterAuth,
  type AuthClientGetSessionAPIResponse,
  type User,
} from "@/lib/better-auth";
import { baseUrl } from "@/lib/gen/base-url";
import { api as api2 } from "@/lib/gen/internal.esensi";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { formatDateObject } from "@/lib/utils";
import {
  BookStatus,
  Role,
  type Book,
  type BookApproval,
} from "backend/api/types";
import {
  CalendarIcon,
  ChevronRight,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

export default () => {
  const local = useLocal(
    {
      user: null as Partial<User> | null,
      bookId: null as string | null,
      book: null as Book | null,
      book_approval: [] as Partial<BookApproval>[],
      loading: true,
      error: "",
      success: "",
      comment: "",
      submitting: false,
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    async () => {
      const session: AuthClientGetSessionAPIResponse =
        await betterAuth.getSession();
      if (!session.data?.user) {
        navigate("/");
        return;
      }
      local.user = session.data.user;

      const params = new URLSearchParams(location.search);
      local.bookId = params.get("id");
      local.page = parseInt(params.get("page") || "1");
      local.limit = parseInt(params.get("limit") || "10");

      if (!local.bookId) {
        local.error = "Buku tidak ditemukan.";
        Alert.info("Buku tidak ditemukan.");
        local.loading = false;
        local.render();
        return;
      }

      try {
        const bookRes = await api.book_detail({ id: local.bookId });
        if (!bookRes.data) {
          local.error = "Buku tidak ditemukan.";
          Alert.info("Buku tidak ditemukan.");
        } else {
          local.book = bookRes.data;
          await loadApprovalList();
        }
      } catch (error) {
        local.error = "Terjadi kesalahan saat memuat data buku.";
        Alert.info("Terjadi kesalahan saat memuat data buku.");
      } finally {
        local.loading = false;
        local.render();
      }
    }
  );

  async function loadApprovalList() {
    try {
      const res = await api.book_approval_list({
        id_book: local.bookId!,
        page: local.page,
        limit: local.limit,
      });

      if (res.data) {
        local.book_approval = res.data;
        if (res.data.length > 0) local.book!.status = res.data[0].book.status;

        if (res.pagination) {
          local.total = res.pagination.total;
          local.page = res.pagination.page;
          local.limit = res.pagination.limit;
          local.totalPages = res.pagination.totalPages;
        }
      }
    } catch (error) {
      local.error = "Terjadi kesalahan saat memuat riwayat persetujuan.";
      Alert.info("Terjadi kesalahan saat memuat riwayat persetujuan.");
    }
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    local.comment = e.target.value;
    local.render();
  };

  const handleSubmitComment = async (status: BookStatus) => {
    if (!local.comment.trim() && status !== BookStatus.PUBLISHED) {
      local.error = "Silakan masukkan komentar terlebih dahulu.";
      Alert.info("Silakan masukkan komentar terlebih dahulu.");
      local.render();
      return;
    }

    if (!local.bookId) {
      local.error = "ID buku tidak ditemukan.";
      Alert.info("ID buku tidak ditemukan.");
      local.render();
      return;
    }

    local.submitting = true;
    local.error = "";
    local.success = "";
    local.render();

    try {
      const res = await api2.book_approval_create({
        id_book: local.bookId,
        comment: local.comment,
        id_internal: local.user?.idInternal!,
        status,
      });

      if (res.success) {
        local.success = "Tanggapan berhasil ditambahkan";
        local.comment = "";

        await loadApprovalList();

        if (status === BookStatus.PUBLISHED) {
          await api2.product_create({ user: local.user!, data: local.book! });
        }
      } else {
        local.error = res.message || "Gagal menambahkan tanggapan";
        Alert.info(res.message || "Gagal menambahkan tanggapan");
      }
    } catch (error) {
      local.error = "Terjadi kesalahan saat mengirim tanggapan.";
      Alert.info("Terjadi kesalahan saat mengirim tanggapan.");
    } finally {
      local.submitting = false;
      local.render();
    }
  };

  async function reloadRiwayatPersetujuan() {
    await loadApprovalList();
    local.success = "";
    local.comment = "";
    local.render();
  }

  if (local.loading) return <AppLoading />;

  return (
    <Protected role={[Role.INTERNAL]}>
      <div className="flex min-h-svh flex-col bg-gray-50">
        <PublishMenuBar />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {local.error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 shadow-sm">
                {local.error}
              </div>
            ) : null}

            {local.success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-8 shadow-sm">
                {local.success}
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
                    onClick={() => navigate("/book-step?id=" + local.bookId)}
                    className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
                  >
                    Proses Buku
                  </button>
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                  <span className="text-gray-800 font-medium">
                    Persetujuan Buku
                  </span>
                </nav>

                {/* Divider line */}
                <div className="border-b border-gray-200 mb-6"></div>

                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Persetujuan Buku</h1>
                  </div>

                  {local.book && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        Status Buku:
                      </span>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-full ${
                          local.book.status === BookStatus.PUBLISHED
                            ? "bg-green-100 text-green-800"
                            : local.book.status === BookStatus.REJECTED
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {local.book.status === BookStatus.PUBLISHED
                          ? "Diterbitkan"
                          : local.book.status === BookStatus.REJECTED
                          ? "Ditolak"
                          : local.book.status === BookStatus.SUBMITTED
                          ? "Diajukan"
                          : "Draft"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Book details section */}
                {local.book && (
                  <Card className="mb-8">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/4">
                          <div className="aspect-[3/4] w-full bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
                            {local.book.cover ? (
                              <img
                                src={
                                  baseUrl.publish_esensi +
                                  "/" +
                                  local.book.cover +
                                  "?w=350"
                                }
                                alt={local.book.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="text-gray-400 text-sm flex items-center justify-center w-full h-full">
                                Tidak ada gambar
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="w-full md:w-3/4">
                          <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {local.book.name}
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                Penulis
                              </p>
                              <p className="font-medium">
                                {local.book.author?.name || "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                Harga
                              </p>
                              <p className="font-medium">
                                Rp{" "}
                                {local.book.submitted_price?.toLocaleString() ||
                                  "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                Jumlah Halaman
                              </p>
                              <p className="font-medium">
                                {local.book.preorder_min_qty || "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                Tanggal Publikasi
                              </p>
                              <p className="font-medium">
                                {local.book.published_date
                                  ? formatDateObject(
                                      new Date(local.book.published_date)
                                    )
                                  : "-"}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-1">
                              Deskripsi
                            </p>
                            <p className="text-sm text-gray-700">
                              {local.book.desc || "Tidak ada deskripsi"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Approval Timeline */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Riwayat Persetujuan</h2>
                </div>

                {local.book_approval.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Belum ada riwayat persetujuan untuk buku ini.
                  </div>
                ) : (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-6 bottom-0 w-0.5 bg-gray-200 ml-0.5"></div>

                    {/* Timeline items */}
                    <div className="space-y-8">
                      {local.book_approval.map((approval, index) => (
                        <div key={approval.id} className="relative pl-14">
                          {/* Timeline dot */}
                          <div
                            className={`absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center ${
                              approval.status === BookStatus.PUBLISHED
                                ? "bg-green-100"
                                : approval.status === BookStatus.REJECTED
                                ? "bg-red-100"
                                : "bg-blue-100"
                            }`}
                          >
                            {approval.status === BookStatus.PUBLISHED ? (
                              <ThumbsUp className={`w-4 h-4 text-green-700`} />
                            ) : approval.status === BookStatus.REJECTED ? (
                              <ThumbsDown className={`w-4 h-4 text-red-700`} />
                            ) : (
                              <MessageCircle
                                className={`w-4 h-4 text-blue-700`}
                              />
                            )}
                          </div>

                          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">
                                <span className="text-blue-800 text-md">
                                  {approval.id_internal
                                    ? "Internal"
                                    : "Penulis"}
                                  &nbsp;
                                </span>
                                {approval.internal?.name ||
                                  local.book?.author?.name}
                                {approval.id_internal && (
                                  <span
                                    className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                      approval.status === BookStatus.PUBLISHED
                                        ? "bg-green-100 text-green-800"
                                        : approval.status ===
                                          BookStatus.REJECTED
                                        ? "bg-red-100 text-red-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {approval.status === BookStatus.PUBLISHED
                                      ? "Disetujui"
                                      : approval.status === BookStatus.REJECTED
                                      ? "Ditolak"
                                      : approval.status === BookStatus.DRAFT
                                      ? "Butuh Revisi Penulis"
                                      : "Komentar"}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <CalendarIcon className="w-3 h-3 mr-1" />
                                {formatDateObject(
                                  new Date(approval.created_at!)
                                )}
                              </div>
                            </div>

                            <div className="text-gray-700 whitespace-pre-line">
                              {approval.comment
                                ? typeof approval.comment === "string"
                                  ? approval.comment
                                  : JSON.stringify(approval.comment)
                                : "Tidak ada komentar"}
                            </div>

                            {/* Lampiran section will be implemented once backend supports attachments */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Pagination */}
                {local.total > local.limit && (
                  <div className="flex justify-center mt-6">
                    <DataPagination
                      total={local.total}
                      page={local.page}
                      limit={local.limit}
                      totalPages={local.totalPages}
                      onReload={reloadRiwayatPersetujuan}
                      onPageChange={async (newPage) => {
                        local.page = newPage;
                        await loadApprovalList();
                        local.render();
                      }}
                      onLimitChange={async (newLimit) => {
                        local.limit = newLimit;
                        local.page = 1;
                        await loadApprovalList();
                        local.render();
                      }}
                    />
                  </div>
                )}

                {/* Add comment/response section */}
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">
                    Tambahkan Tanggapan
                  </h3>
                  <div className="flex flex-col gap-4">
                    <textarea
                      className="w-full border border-gray-300 rounded-md p-3 min-h-[120px]"
                      placeholder="Tulis tanggapan atau komentar anda..."
                      value={local.comment}
                      onChange={handleCommentChange}
                      disabled={local.submitting}
                    />
                    <div className="flex justify-end gap-3">
                      <Button
                        className="bg-red-800 text-white"
                        onClick={() => handleSubmitComment(BookStatus.REJECTED)}
                        disabled={local.submitting || !local.comment.trim()}
                      >
                        {local.submitting ? "Menolak..." : "Tolak"}
                      </Button>
                      <Button
                        className="bg-yellow-600 text-white"
                        onClick={() => handleSubmitComment(BookStatus.DRAFT)}
                        disabled={local.submitting || !local.comment.trim()}
                      >
                        {local.submitting
                          ? "Meminta Revisi Penulis..."
                          : "Minta Revisi Penulis"}
                      </Button>
                      <Button
                        className="bg-green-800 text-white"
                        onClick={() =>
                          handleSubmitComment(BookStatus.PUBLISHED)
                        }
                        disabled={
                          local.book?.status === BookStatus.PUBLISHED ||
                          local.book?.status === BookStatus.REJECTED
                        }
                      >
                        {local.submitting ? "Menyetujui..." : "Setuju"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Protected>
  );
};
