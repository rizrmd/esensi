import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { MenuBarInternal } from "@/components/ext/menu-bar/internal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/gen/internal.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { Role } from "backend/lib/types";
import {
  ArrowLeft,
  BarChart3,
  Book,
  Package,
  RefreshCw,
  Search,
  TrendingUp,
  User as UserIcon,
  Users,
} from "lucide-react";

interface OverallStats {
  total_authors: number;
  authors_with_books: number;
  authors_with_products: number;
  authors_with_publishers: number;
  authors_without_content: number;
}

interface AuthorSpecificStats {
  author: {
    id: string;
    name: string;
    book_count: number;
    product_count: number;
    publisher_count: number;
  };
}

export default () => {
  const local = useLocal(
    {
      loading: true,
      error: "",
      overallStats: null as OverallStats | null,
      authorStats: null as AuthorSpecificStats | null,
      searchAuthorId: "",
      searchLoading: false,
    },
    async () => {
      await loadOverallStats();
    }
  );

  const loadOverallStats = async () => {
    try {
      local.loading = true;
      local.error = "";
      local.render();

      const result = await api.author_stats({});
      if (result) {
        local.overallStats = result as OverallStats;
      }
    } catch (error: any) {
      console.error("Error loading overall stats:", error);
      local.error = error.message || "Terjadi kesalahan saat memuat statistik";
    } finally {
      local.loading = false;
      local.render();
    }
  };

  const searchAuthorStats = async () => {
    if (!local.searchAuthorId.trim()) {
      local.error = "Masukkan ID penulis untuk mencari statistik spesifik";
      local.render();
      return;
    }

    try {
      local.searchLoading = true;
      local.error = "";
      local.render();

      const result = await api.author_stats({
        id: local.searchAuthorId.trim(),
      });

      if (result) {
        local.authorStats = result as AuthorSpecificStats;
      }
    } catch (error: any) {
      console.error("Error loading author stats:", error);
      local.error =
        error.message || "Terjadi kesalahan saat mencari statistik penulis";
      local.authorStats = null;
    } finally {
      local.searchLoading = false;
      local.render();
    }
  };

  const clearAuthorSearch = () => {
    local.searchAuthorId = "";
    local.authorStats = null;
    local.error = "";
    local.render();
  };

  if (local.loading) {
    return (
      <Protected role={Role.INTERNAL}>
        <div className="flex flex-col min-h-screen bg-background">
          <MenuBarInternal />
          <div className="flex-1 flex items-center justify-center">
            <AppLoading />
          </div>
        </div>
      </Protected>
    );
  }

  return (
    <Protected role={Role.INTERNAL}>
      <div className="flex flex-col min-h-screen bg-background">
        <MenuBarInternal />

        <div className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            {/* Back Button */}
            <div className="mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/manage-author")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Kelola Penulis
              </Button>
            </div>
            
            {/* Title and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  Statistik Penulis
                </h1>
                <p className="text-muted-foreground text-lg">
                  Analisis data dan statistik penulis di platform
                </p>
              </div>
              
              <Button
                variant="outline"
                onClick={loadOverallStats}
                disabled={local.loading}
                className="self-start sm:self-auto"
              >
                {local.loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Memuat...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </>
                )}
              </Button>
            </div>
          </div>

          {local.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {local.error}
            </div>
          )}

          {/* Overall Statistics */}
          {local.overallStats && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Statistik Keseluruhan
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Penulis
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {local.overallStats.total_authors.toLocaleString("id-ID")}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Jumlah total penulis terdaftar
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Penulis dengan Buku
                    </CardTitle>
                    <Book className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {local.overallStats.authors_with_books.toLocaleString(
                        "id-ID"
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Penulis yang memiliki buku
                    </p>
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {(
                          (local.overallStats.authors_with_books /
                            local.overallStats.total_authors) *
                          100
                        ).toFixed(1)}
                        %
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Penulis dengan Produk
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {local.overallStats.authors_with_products.toLocaleString(
                        "id-ID"
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Penulis yang memiliki produk
                    </p>
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {(
                          (local.overallStats.authors_with_products /
                            local.overallStats.total_authors) *
                          100
                        ).toFixed(1)}
                        %
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Penulis dengan Penerbit
                    </CardTitle>
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {local.overallStats.authors_with_publishers.toLocaleString(
                        "id-ID"
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Penulis yang terhubung dengan penerbit
                    </p>
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {(
                          (local.overallStats.authors_with_publishers /
                            local.overallStats.total_authors) *
                          100
                        ).toFixed(1)}
                        %
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Penulis Tanpa Konten
                    </CardTitle>
                    <Users className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-600">
                      {local.overallStats.authors_without_content.toLocaleString(
                        "id-ID"
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Penulis tanpa buku atau produk
                    </p>
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className="text-xs text-amber-600 border-amber-300"
                      >
                        {(
                          (local.overallStats.authors_without_content /
                            local.overallStats.total_authors) *
                          100
                        ).toFixed(1)}
                        %
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <Separator className="my-8" />

          {/* Author-Specific Search */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Search className="h-6 w-6" />
              Statistik Penulis Spesifik
            </h2>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Cari Statistik Penulis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search-author">ID Penulis</Label>
                    <Input
                      id="search-author"
                      type="text"
                      value={local.searchAuthorId}
                      onChange={(e) => {
                        local.searchAuthorId = e.target.value;
                        local.render();
                      }}
                      placeholder="Masukkan ID penulis"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button
                      onClick={searchAuthorStats}
                      disabled={local.searchLoading}
                    >
                      {local.searchLoading ? (
                        <>
                          <Search className="h-4 w-4 mr-2 animate-spin" />
                          Mencari...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Cari
                        </>
                      )}
                    </Button>
                    {local.authorStats && (
                      <Button variant="outline" onClick={clearAuthorSearch}>
                        Bersihkan
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Author-Specific Results */}
            {local.authorStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    {local.authorStats.author.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    ID: {local.authorStats.author.id}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Book className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold text-blue-600">
                        {local.authorStats.author.book_count}
                      </div>
                      <p className="text-sm text-blue-700">Buku</p>
                    </div>

                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Package className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold text-green-600">
                        {local.authorStats.author.product_count}
                      </div>
                      <p className="text-sm text-green-700">Produk</p>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold text-purple-600">
                        {local.authorStats.author.publisher_count}
                      </div>
                      <p className="text-sm text-purple-700">Penerbit</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(
                          `/author-detail?id=${local.authorStats!.author.id}`
                        )
                      }
                    >
                      Lihat Detail Penulis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Protected>
  );
};
