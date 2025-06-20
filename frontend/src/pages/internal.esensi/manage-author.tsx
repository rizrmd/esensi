import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { Error } from "@/components/ext/error";
import { MenuBarInternal } from "@/components/ext/menu-bar/internal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataPagination } from "@/components/ui/data-pagination";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/gen/internal.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { Role } from "backend/lib/types";
import {
  BarChart3,
  Book,
  Edit,
  Eye,
  Package,
  PlusCircle,
  Search,
  Trash2,
  User as UserIcon,
} from "lucide-react";

interface Author {
  id: string;
  name: string;
  biography: string | null;
  social_media: string | null;
  avatar: string | null;
  id_account: string | null;
  id_user: string | null;
  cfg: any;
  auth_user?: any[];
  auth_account?: any;
  book?: any[];
  product?: any[];
}

export default () => {
  const local = useLocal(
    {
      authors: [] as Author[],
      loading: true,
      total: 0,
      page: 1,
      limit: 20,
      offset: 0,
      totalPages: 0,
      search: "",
      error: "",
      selectedAuthors: new Set<string>(),
    },
    async () => {
      const params = new URLSearchParams(location.search);
      local.page = parseInt(params.get("page") || "1");
      local.limit = parseInt(params.get("limit") || "20");
      local.search = params.get("search") || "";
      local.offset = (local.page - 1) * local.limit;
      await loadData();
    }
  );

  async function loadData() {
    local.loading = true;
    local.error = "";
    local.render();

    try {
      const result = await api.author_list({
        search: local.search || undefined,
        limit: local.limit,
        offset: local.offset,
        include_user: true,
        include_account: true,
      });

      if (result && result.data) {
        local.authors = result.data;
        local.total = result.total || 0;
        local.totalPages = Math.ceil(local.total / local.limit);
      }
    } catch (error) {
      console.error("Error loading authors:", error);
      local.error = "Terjadi kesalahan saat memuat data penulis.";
    }

    local.loading = false;
    local.render();
  }

  const handleSearch = async (value: string) => {
    local.search = value;
    local.page = 1;
    local.offset = 0;

    // Update URL
    const params = new URLSearchParams();
    if (value) params.set("search", value);
    params.set("page", "1");
    params.set("limit", local.limit.toString());
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );

    await loadData();
  };

  const handlePageChange = async (page: number) => {
    local.page = page;
    local.offset = (page - 1) * local.limit;

    // Update URL
    const params = new URLSearchParams();
    if (local.search) params.set("search", local.search);
    params.set("page", page.toString());
    params.set("limit", local.limit.toString());
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );

    await loadData();
  };

  const handleLimitChange = async (limit: number) => {
    local.limit = limit;
    local.page = 1;
    local.offset = 0;

    // Update URL
    const params = new URLSearchParams();
    if (local.search) params.set("search", local.search);
    params.set("page", "1");
    params.set("limit", limit.toString());
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );

    await loadData();
  };

  const handleDelete = async (authorId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus penulis ini?")) return;

    try {
      await api.author_delete({ id: authorId });
      await loadData();
    } catch (error) {
      console.error("Error deleting author:", error);
      local.error = "Gagal menghapus penulis.";
      local.render();
    }
  };

  const toggleSelectAuthor = (authorId: string) => {
    if (local.selectedAuthors.has(authorId)) {
      local.selectedAuthors.delete(authorId);
    } else {
      local.selectedAuthors.add(authorId);
    }
    local.render();
  };

  const selectAllAuthors = () => {
    if (local.selectedAuthors.size === local.authors.length) {
      local.selectedAuthors.clear();
    } else {
      local.authors.forEach((author) => local.selectedAuthors.add(author.id));
    }
    local.render();
  };

  return (
    <Protected role={Role.INTERNAL}>
      <div className="flex flex-col min-h-screen bg-background">
        <MenuBarInternal />

        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Kelola Penulis</h1>
                <p className="text-muted-foreground mt-2">
                  Kelola data penulis di seluruh platform
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/author-stats")}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Statistik
                </Button>
                <Button
                  onClick={() => navigate("/author-create")}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Tambah Penulis
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari penulis..."
                  value={local.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {local.selectedAuthors.size > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {local.selectedAuthors.size} dipilih
                  </Badge>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      // Handle bulk delete
                      const selectedCount = local.selectedAuthors.size;
                      if (
                        confirm(
                          `Hapus ${selectedCount} penulis yang dipilih? Tindakan ini tidak dapat dibatalkan.`
                        )
                      ) {
                        try {
                          local.loading = true;
                          local.render();

                          const selectedIds = Array.from(local.selectedAuthors);
                          const promises = selectedIds.map((id) =>
                            api.author_delete({ id })
                          );

                          await Promise.all(promises);

                          // Clear selection and reload
                          local.selectedAuthors.clear();
                          await loadData();

                          // Show success message
                          const successMsg = `${selectedCount} penulis berhasil dihapus`;
                          alert(successMsg);
                        } catch (error: any) {
                          console.error("Error bulk deleting authors:", error);
                          local.error =
                            error.message || "Gagal menghapus penulis";
                        } finally {
                          local.loading = false;
                          local.render();
                        }
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Hapus
                  </Button>
                </div>
              )}
            </div>
          </div>

          {local.error && <Error msg={local.error} loading={false} />}

          {local.loading ? (
            <AppLoading />
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Penulis
                    </CardTitle>
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{local.total}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Dengan Akun
                    </CardTitle>
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {local.authors.filter((a) => a.auth_account).length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Aktif</CardTitle>
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {
                        local.authors.filter(
                          (a) => a.auth_user && a.auth_user.length > 0
                        ).length
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Authors Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Daftar Penulis</CardTitle>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          local.selectedAuthors.size === local.authors.length &&
                          local.authors.length > 0
                        }
                        onChange={selectAllAuthors}
                        className="rounded"
                      />
                      <span className="text-sm text-muted-foreground">
                        Pilih Semua
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {local.authors.length > 0 ? (
                    <div className="space-y-4">
                      {local.authors.map((author) => (
                        <div
                          key={author.id}
                          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={local.selectedAuthors.has(author.id)}
                            onChange={() => toggleSelectAuthor(author.id)}
                            className="rounded"
                          />

                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                              {author.avatar ? (
                                <img
                                  src={author.avatar}
                                  alt={author.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <UserIcon className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold truncate">
                                  {author.name}
                                </h3>
                                {author.auth_account && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Verified
                                  </Badge>
                                )}
                              </div>

                              {author.biography && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                  {author.biography}
                                </p>
                              )}

                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Book className="h-3 w-3" />
                                  <span>{author.book?.length || 0} Buku</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Package className="h-3 w-3" />
                                  <span>
                                    {author.product?.length || 0} Produk
                                  </span>
                                </div>
                                {author.social_media && (
                                  <a
                                    href={author.social_media}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    Media Sosial
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/author-detail?id=${author.id}`)
                              }
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Lihat
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/author-edit?id=${author.id}`)
                              }
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(author.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Hapus
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <UserIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        {local.search
                          ? "Penulis tidak ditemukan"
                          : "Belum ada penulis"}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {local.search
                          ? "Coba gunakan kata kunci yang berbeda"
                          : "Mulai dengan menambahkan penulis pertama"}
                      </p>
                      {!local.search && (
                        <Button onClick={() => navigate("/author-create")}>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Tambah Penulis
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {local.total > local.limit && (
                <div className="mt-8">
                  <DataPagination
                    total={local.total}
                    page={local.page}
                    limit={local.limit}
                    totalPages={local.totalPages}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                    onReload={loadData}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Protected>
  );
};
