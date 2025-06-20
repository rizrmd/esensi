import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { Breadcrumb } from "@/components/ext/book/breadcrumb/approval";
import { Error } from "@/components/ext/error";
import { Img } from "@/components/ext/img/approval";
import { MenuBarPublish } from "@/components/ext/menu-bar/publish";
import { PublishFallback } from "@/components/ext/publish-fallback";
import { Success } from "@/components/ext/success";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataPagination } from "@/components/ui/data-pagination";
import { Alert } from "@/components/ui/global-alert";
import { baseUrl } from "@/lib/gen/base-url";
import { api as api2 } from "@/lib/gen/internal.esensi";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { formatCurrency, formatDateObject, validate } from "@/lib/utils";
import {
  BookStatus,
  Role,
  type Book,
  type BookApproval,
} from "backend/lib/types";
import {
  CalendarIcon,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

export default () => {
  const local = useLocal(
    {
      bookId: null as string | null,
      book: undefined as Book | undefined,
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
      const params = new URLSearchParams(location.search);
      local.bookId = params.get("id");
      local.page = parseInt(params.get("page") || "1");
      local.limit = parseInt(params.get("limit") || "10");
      if (validate(!local.bookId, local, "ID buku tidak ditemukan.")) {
        navigate("/manage-book");
        return;
      }

      try {
        const res = await api.book_detail({ id: local.bookId! });
        if (validate(!res.data, local, "Buku tidak ditemukan.")) {
          navigate("/manage-book");
          return;
        } else {
          local.book = res.data;
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
    if (!local.comment.trim()) {
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
      const response = await api2.book_approval_create({
        id_book: local.bookId,
        comment: local.comment,
        status,
      });

      if (response.success) {
        local.success = "Tanggapan berhasil ditambahkan";
        local.comment = "";

        await loadApprovalList();
      } else {
        local.error = response.message || "Gagal menambahkan tanggapan";
        Alert.info(response.message || "Gagal menambahkan tanggapan");
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
    <Protected role={[Role.AUTHOR, Role.PUBLISHER]} fallback={PublishFallback}>
      <div className="flex min-h-svh flex-col bg-gray-50">
        <MenuBarPublish />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <Error msg={local.error} />
            <Success msg={local.success} />
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <Breadcrumb id={local.bookId!} />
                <div className="flex justify-between items-center mb-6">
                  <h1 className=" text-2xl font-bold">Persetujuan Buku</h1>
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
                            : "bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                        }`}
                        onClick={() => {
                          if (local.book?.status === BookStatus.DRAFT)
                            navigate("/book-update?id=" + local.bookId);
                        }}
                      >
                        {local.book.status === BookStatus.PUBLISHED
                          ? "Diterbitkan"
                          : local.book.status === BookStatus.REJECTED
                          ? "Ditolak"
                          : local.book.status === BookStatus.SUBMITTED
                          ? "Diajukan"
                          : "Butuh Revisi Penulis ❗"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Book details section */}
                {local.book && (
                  <Card className="mb-8">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <Img
                          check={!!local.book.cover}
                          src={
                            baseUrl.publish_esensi +
                            "/" +
                            local.book.cover +
                            "?w=350"
                          }
                          alt={local.book.name}
                        />
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
                                {formatCurrency(
                                  local.book.submitted_price,
                                  local.book.currency
                                )}
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
                  {/* Top Pagination */}
                  <div className="flex justify-end mt-6">
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
                                {index === local.book_approval.length - 1 && (
                                  <span
                                    className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                      approval.status === BookStatus.PUBLISHED
                                        ? "bg-green-100 text-green-800"
                                        : approval.status ===
                                          BookStatus.REJECTED
                                        ? "bg-red-100 text-red-800"
                                        : "bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                                    }`}
                                    onClick={() => {
                                      if (
                                        local.book?.status === BookStatus.DRAFT
                                      )
                                        navigate(
                                          "/book-update?id=" + local.bookId
                                        );
                                    }}
                                  >
                                    {approval.status === BookStatus.PUBLISHED
                                      ? "Disetujui"
                                      : approval.status === BookStatus.REJECTED
                                      ? "Ditolak"
                                      : approval.status === BookStatus.DRAFT
                                      ? "Butuh Revisi Penulis ❗"
                                      : ""}
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
                <div className="flex justify-end mt-6">
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
                      {local.book?.status === BookStatus.DRAFT && (
                        <Button
                          onClick={() =>
                            handleSubmitComment(BookStatus.SUBMITTED)
                          }
                          disabled={local.submitting || !local.comment.trim()}
                        >
                          {local.submitting ? "Mengajukan..." : "Ajukan"}
                        </Button>
                      )}
                      <Button
                        onClick={() =>
                          handleSubmitComment(local.book?.status! as BookStatus)
                        }
                        disabled={
                          local.submitting ||
                          !local.comment.trim() ||
                          local.book?.status === BookStatus.PUBLISHED ||
                          local.book?.status === BookStatus.REJECTED
                        }
                      >
                        {local.submitting ? "Mengkomentari..." : "Komentari"}
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
