import { Protected } from "@/components/app/protected";
import { Breadcrumb } from "@/components/ext/book/breadcrumb/step";
import { BookStepItem } from "@/components/ext/book/step-item";
import { Error } from "@/components/ext/error";
import { MenuBarInternal } from "@/components/ext/menu-bar/internal";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import type { BookStep } from "@/lib/utils";
import { BookStatus, Role, type Book } from "backend/api/types";

export default function BookStepPag() {
  const local = useLocal(
    {
      book: null as Book | null,
      loading: true,
      error: "",
      steps: [] as BookStep[],
      step: 0,
    },
    async () => {
      const params = new URLSearchParams(location.search);
      const bookId = params.get("id");
      const bookIdQueryString = bookId ? `?id=${bookId}` : "";

      if (!!bookId) {
        try {
          const res = await api.book_detail({ id: bookId });
          if (!res.data) local.error = "Buku tidak ditemukan.";
          else {
            local.book = res.data;
            if (res.data.status === BookStatus.DRAFT) local.step = 0;
            else if (res.data.status === BookStatus.SUBMITTED) local.step = 1;
            else if (res.data.status === BookStatus.PUBLISHED) local.step = 2;
            else if (res.data.status === BookStatus.REJECTED) local.step = -1;
          }
        } catch (error) {
          local.error = "Terjadi kesalahan saat memuat data buku.";
        } finally {
          local.steps = [
            {
              title: "Formulir Informasi Buku",
              description:
                "Internal bisa melihat data informasi buku yang diisi penulis.",
              link: "book-detail" + bookIdQueryString,
            },
            {
              title: "Persetujuan Buku",
              description:
                "Internal bisa berkomunikasi dengan penulis untuk memeriksa kelayakan buku untuk terbit.",
              link: "book-approval" + bookIdQueryString,
            },
            {
              title: "Penjualan Buku",
              description:
                "Internal bisa melihat laporan penjualan buku yang sudah terbit.",
              link: "book-sales" + bookIdQueryString,
            },
          ];
          local.loading = false;
          local.render();
        }
      }
    }
  );

  return (
    <Protected role={[Role.INTERNAL]}>
      <div className="flex min-h-svh flex-col bg-gray-50">
        <MenuBarInternal />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <Breadcrumb />
                <div className="flex justify-between items-center mb-6">
                  <div className="flex flex-col gap-4">
                    <h1 className="text-2xl font-bold">Proses Buku</h1>
                    <span className="text-gray-500 text-sm md:text-base">
                      Berikut adalah langkah-langkah yang harus dilakukan untuk
                      menerbitkan buku. Silakan klik pada setiap langkah untuk
                      melihat detailnya.
                    </span>
                  </div>
                </div>
                <Error msg={local.error}>
                  {local.steps.map((step, index) => (
                    <BookStepItem
                      key={index}
                      step={step}
                      index={index}
                      currentStep={local.step}
                      book={local.book}
                    />
                  ))}
                </Error>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Protected>
  );
}
