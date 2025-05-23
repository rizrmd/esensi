import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { BookStepItem } from "@/components/publish/book-step-item";
import { PublishMenuBar } from "@/components/publish/menu-bar";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { BookStatus, type Book } from "backend/api/types";
import { ChevronRight } from "lucide-react";

type step = {
  title: string;
  description: string;
  link: string;
};

export default function BookStepPag() {
  const local = useLocal(
    {
      book: null as Book | null,
      loading: true,
      error: "",
      steps: [] as step[],
      step: 0,
    },
    async () => {
      const params = new URLSearchParams(location.search);
      const bookId = params.get("id");
      const bookIdQueryString = bookId ? `?id=${bookId}` : "";
      local.steps = [
        {
          title: "Formulir Informasi Buku",
          description:
            "Penulis bisa menambah dan memperbarui data informasi buku.",
          link:
            (local.step > 0
              ? "book-detail"
              : bookId
              ? "book-update"
              : "book-create") + bookIdQueryString,
        },
        {
          title: "Persetujuan Penerbitan Buku",
          description:
            "Penulis bisa berkomunikasi dengan internal untuk memeriksa kelayakan buku untuk terbit.",
          link: "book-approval" + bookIdQueryString,
        },
        {
          title: "Penjualan Buku",
          description:
            "Penulis bisa melihat laporan penjualan buku yang sudah terbit.",
          link: "book-publish" + bookIdQueryString,
        },
      ];
      if (!!bookId) {
        try {
          const res = await api.book_detail({ id: bookId });
          if (!res.data) {
            local.error = "Buku tidak ditemukan.";
          } else {
            local.book = res.data;
            if (res.data.status === BookStatus.DRAFT) local.step = 0;
            else if (res.data.status === BookStatus.SUBMITTED) local.step = 1;
            else if (res.data.status === BookStatus.PUBLISHED) local.step = 2;
            else if (res.data.status === BookStatus.REJECTED) local.step = -1;
          }
        } catch (error) {
          local.error = "Terjadi kesalahan saat memuat data buku.";
        } finally {
          local.loading = false;
          local.render();
        }
      }
    }
  );

  return (
    <>
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
                        <span className="text-gray-800 font-medium">
                          Proses Buku
                        </span>
                      </nav>

                      {/* Divider line */}
                      <div className="border-b border-gray-200 mb-6"></div>

                      <div className="flex justify-between items-center mb-6">
                        <div className="flex flex-col gap-4">
                          <h1 className="text-2xl font-bold">Proses Buku</h1>
                          <span className="text-gray-500 text-sm md:text-base">
                            Untuk menerbitkan buku, penulis harus melakukan
                            semua 3 proses di bawah ini secara bertahap.
                          </span>
                        </div>
                      </div>

                      {local.error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 shadow-sm">
                          {local.error}
                        </div>
                      ) : (
                        local.steps.map((step, index) => (
                          <BookStepItem
                            key={index}
                            step={step}
                            index={index}
                            currentStep={local.step}
                            book={local.book}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </main>
            </div>
          );
        }}
      </Protected>
    </>
  );
}
