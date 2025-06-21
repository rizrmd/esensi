import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { Error } from "@/components/ext/error";
import { MenuBarInternal } from "@/components/ext/menu-bar/internal";
import NoAccess from "@/components/ext/no-access";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataPagination } from "@/components/ui/data-pagination";
import { Input } from "@/components/ui/input";
import { betterAuth } from "@/lib/better-auth";
import { api } from "@/lib/gen/internal.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import type { User } from "backend/lib/better-auth";
import { Role } from "backend/lib/types";
import { Edit, PlusCircle, Search, Trash2 } from "lucide-react";

export const current = {
  user: undefined as User | undefined,
};

interface CfgItem {
  key: string;
  value: string;
}

export default () => {
  const local = useLocal(
    {
      configs: [] as CfgItem[],
      loading: true,
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 0,
      error: "",
      success: "",
      search: "",
      searchInput: "",
      isDeleting: false,
    },
    async () => {
      const params = new URLSearchParams(location.search);
      local.page = parseInt(params.get("page") || "1");
      local.limit = parseInt(params.get("limit") || "50");
      local.search = params.get("search") || "";
      local.searchInput = local.search;

      const res = await betterAuth.getSession();
      current.user = res.data?.user;
      await loadData();
    }
  );

  async function loadData() {
    local.loading = true;
    local.error = "";
    local.render();

    try {
      const offset = (local.page - 1) * local.limit;
      const res = await api.cfg_list({
        search: local.search || undefined,
        limit: local.limit,
        offset: offset,
      });

      local.configs = res.data || [];
      local.total = res.total || 0;
      local.totalPages = Math.ceil(local.total / local.limit);
    } catch (error) {
      local.error = "Terjadi kesalahan saat memuat data konfigurasi.";
      console.error(error);
    } finally {
      local.loading = false;
      local.render();
    }
  }

  async function handleSearch() {
    local.search = local.searchInput;
    local.page = 1;

    // Update URL
    const params = new URLSearchParams();
    if (local.search) params.set("search", local.search);
    params.set("page", "1");
    params.set("limit", local.limit.toString());

    const newUrl = location.pathname + "?" + params.toString();
    history.pushState({}, "", newUrl);

    await loadData();
  }

  async function handleDelete(key: string) {
    local.isDeleting = true;
    local.error = "";
    local.render();

    try {
      await api.cfg_delete({ key });
      local.success = "Konfigurasi berhasil dihapus.";
      await loadData();

      // Clear success message after 3 seconds
      setTimeout(() => {
        local.success = "";
        local.render();
      }, 3000);
    } catch (error) {
      local.error = "Terjadi kesalahan saat menghapus konfigurasi.";
      console.error(error);
    } finally {
      local.isDeleting = false;
      local.render();
    }
  }

  if (local.loading && local.configs.length === 0) return <AppLoading />;
  if (!current.user?.internal?.is_it && !current.user?.internal?.is_management)
    return <NoAccess />;

  return (
    <Protected role={[Role.INTERNAL]}>
      <div className="flex min-h-svh flex-col bg-gray-50">
        <MenuBarInternal />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <Error msg={local.error} />
            {local.success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800">{local.success}</p>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="mx-8 py-8">
                <div className="flex justify-between items-start mb-8 gap-4">
                  <h1 className="text-2xl font-bold">Kelola Konfigurasi</h1>
                  <Button
                    onClick={() => navigate("/cfg-create")}
                    className="flex items-center gap-2"
                    variant="default"
                  >
                    <PlusCircle className="h-5 w-5" />
                    <span>Tambah Konfigurasi</span>
                  </Button>
                </div>

                {/* Search */}
                <div className="flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Cari berdasarkan key atau value..."
                      value={local.searchInput}
                      onChange={(e) => {
                        local.searchInput = e.target.value;
                        local.render();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={handleSearch} variant="outline">
                    Cari
                  </Button>
                  {local.search && (
                    <Button
                      onClick={() => {
                        local.search = "";
                        local.searchInput = "";
                        local.page = 1;
                        history.pushState({}, "", location.pathname);
                        loadData();
                      }}
                      variant="outline"
                    >
                      Reset
                    </Button>
                  )}
                </div>

                {/* Pagination */}
                <div className="mb-6">
                  <DataPagination
                    total={local.total}
                    page={local.page}
                    limit={local.limit}
                    totalPages={local.totalPages}
                    onReload={loadData}
                    onPageChange={async (newPage) => {
                      local.page = newPage;
                      const params = new URLSearchParams(location.search);
                      params.set("page", newPage.toString());
                      history.pushState(
                        {},
                        "",
                        location.pathname + "?" + params.toString()
                      );
                      await loadData();
                    }}
                    onLimitChange={async (newLimit) => {
                      local.limit = newLimit;
                      local.page = 1;
                      const params = new URLSearchParams(location.search);
                      params.set("limit", newLimit.toString());
                      params.set("page", "1");
                      history.pushState(
                        {},
                        "",
                        location.pathname + "?" + params.toString()
                      );
                      await loadData();
                    }}
                  />
                </div>

                {/* Content */}
                {local.loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Memuat data...</p>
                  </div>
                ) : local.configs.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    {local.search
                      ? "Tidak ada konfigurasi yang ditemukan."
                      : "Belum ada konfigurasi."}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {local.configs.map((config) => (
                      <Card
                        key={config.key}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">
                              {config.key}
                            </CardTitle>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  navigate(
                                    `/cfg-edit?key=${encodeURIComponent(
                                      config.key
                                    )}`
                                  )
                                }
                                className="flex items-center gap-1"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    disabled={local.isDeleting}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Hapus
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Hapus Konfigurasi
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Apakah Anda yakin ingin menghapus
                                      konfigurasi dengan key "{config.key}"?
                                      Tindakan ini tidak dapat dibatalkan.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(config.key)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Hapus
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-gray-600 mb-1">Value:</p>
                            <p className="font-mono text-sm break-all">
                              {config.value}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Protected>
  );
};
