import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { PublishMenuBar } from "@/components/publish/menu-bar";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import type { Book } from "backend/api/types";
import { ArrowLeft, ChevronRight } from "lucide-react";

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
          title: "Susun",
          description:
            "Proses pengisian formulir untuk menambah dan memperbarui data buku",
          link: (bookId ? "book-update" : "book-create") + bookIdQueryString,
        },
        {
          title: "Ajukan",
          description: "Proses pengajuan persetujuan buku untuk diterbitkan",
          link: "book-submit" + bookIdQueryString,
        },
        {
          title: "Terbitkan",
          description:
            "Proses penjualan buku yang sudah terbit. Anda bisa melihat laporan penjualan",
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
                        <div className="flex items-center gap-4">
                          <h1 className="text-2xl font-bold">
                            Proses Buku (Belum Disetujui)
                          </h1>
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
                            className="flex items-center justify-between mb-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                                {index + 1}
                              </div>
                              <div>
                                <h2 className="text-lg font-semibold">
                                  {step.title}
                                </h2>
                                <p className="text-gray-500">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="link"
                              onClick={() => navigate(step.link)}
                              className="text-blue-600 hover:underline"
                            >
                              Lanjutkan
                            </Button>
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
