import { Protected } from "@/components/app/protected";
import { InternalMenuBar } from "@/components/internal/menu-bar";
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
      <Protected role={["internal"]}>
        {({ user }) => {
          return (
            <div className="flex min-h-svh flex-col bg-gray-50">
              <InternalMenuBar />
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
                          <div
                            key={index}
                            className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-100 last:border-0"
                          >
                            <div
                              className={`flex items-center gap-3 md:gap-4 ${
                                index <= local.step
                                  ? "opacity-100 cursor-pointer"
                                  : "opacity-50"
                              }`}
                              onClick={() => navigate(step.link)}
                            >
                              <div
                                className={`min-w-[32px] h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                                  index <= local.step
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                                style={{ width: "32px" }}
                              >
                                {index + 1}
                              </div>
                              <div className="pt-1 md:pt-0">
                                <h2 className="text-lg font-semibold">
                                  {step.title}

                                  <span
                                    className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                      local.step > index
                                        ? "bg-green-100 text-green-800"
                                        : local.step === index
                                        ? "bg-red-100 text-red-800"
                                        : ""
                                    }`}
                                  >
                                    {local.step > index
                                      ? "Sudah"
                                      : local.step === index
                                      ? "Belum"
                                      : ""}
                                  </span>
                                </h2>
                                <p className="text-gray-500 text-sm md:text-base">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          </div>
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
