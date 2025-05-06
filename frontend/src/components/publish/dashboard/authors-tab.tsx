import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { navigate } from "@/lib/router";
import type { DashboardData } from "./types";
import { Input } from "@/components/ui/input";
import type { FormEvent } from "react";
import { useLocal } from "@/lib/hooks/use-local";
import {
  UserPlus,
  Users,
  Search,
  BookOpen,
  FilterX,
  UserCog,
  BarChart,
  ArrowRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AuthorsTabProps {
  data: DashboardData;
}

export const AuthorsTab = ({ data }: AuthorsTabProps) => {
  const local = useLocal(
    {
      searchQuery: "",
      searchResults: data.authors || [],
      isSearching: false,
    },
    async () => {
      local.searchResults = data.authors || [];
      local.render();
    }
  );

  const handleSearchChange = (value: string) => {
    local.searchQuery = value;

    if (!value.trim()) {
      local.searchResults = data.authors || [];
      local.render();
      return;
    }

    local.render();
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    local.isSearching = true;
    local.render();

    try {
      // Filter authors based on search query
      const filtered = (data.authors || []).filter(
        (author) =>
          author.name.toLowerCase().includes(local.searchQuery.toLowerCase()) ||
          (author.auth_user?.[0]?.email &&
            author.auth_user[0].email
              .toLowerCase()
              .includes(local.searchQuery.toLowerCase()))
      );

      local.searchResults = filtered;
    } catch (error) {
      console.error("Error searching authors:", error);
      local.searchResults = [];
    } finally {
      local.isSearching = false;
      local.render();
    }
  };

  const resetSearch = () => {
    local.searchQuery = "";
    local.searchResults = data.authors || [];
    local.render();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Penulis</h1>
          <p className="text-muted-foreground mt-1">
            Kelola penulis dan lihat status produk mereka
          </p>
        </div>
        <Button
          onClick={() => navigate("/publish/add-author")}
          className="gap-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Tambah Penulis</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-auto flex-1">
          <form className="relative" onSubmit={handleSearch}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau email penulis..."
              value={local.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-3"
            />
            <Button
              type="submit"
              disabled={local.isSearching}
              size="sm"
              variant="ghost"
              className="absolute right-0 top-0 h-full"
            >
              {local.isSearching ? "Mencari..." : "Cari"}
            </Button>
          </form>
        </div>
      </div>

      {/* Results info */}
      {local.searchQuery && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Menampilkan {local.searchResults.length} penulis
            {local.searchQuery && ` untuk "${local.searchQuery}"`}
          </span>
          {local.searchQuery && (
            <Button
              size="sm"
              variant="ghost"
              onClick={resetSearch}
              className="h-8 gap-1"
            >
              <FilterX className="h-3 w-3" />
              Reset
            </Button>
          )}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {local.searchResults.map((author) => (
          <Card
            key={author.id}
            className="overflow-hidden hover:border-primary/50 transition-colors duration-200"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border bg-primary/5">
                  <AvatarFallback className="text-primary-foreground bg-primary">
                    {getInitials(author.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{author.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {author.auth_user?.[0]?.email || "Email tidak tersedia"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mt-4 items-center">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Total Produk
                  </span>
                </div>
                <div className="bg-primary/10 px-2 py-1 rounded-md text-sm font-medium">
                  {author.productCount || 0}
                </div>
              </div>

              <div className="flex justify-between mt-3 items-center">
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Status</span>
                </div>
                <div className="bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full text-xs font-medium">
                  Aktif
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between"
                onClick={() =>
                  navigate(`/publish/author-products/${author.id}`)
                }
              >
                <span className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Lihat Produk
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between"
                onClick={() => navigate(`/publish/author/${author.id}`)}
              >
                <span className="flex items-center">
                  <UserCog className="mr-2 h-4 w-4" />
                  Kelola Penulis
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        {local.searchResults.length === 0 && (
          <Card className="col-span-full p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <Users className="h-10 w-10 text-muted-foreground opacity-30" />
              {data.authors?.length === 0 ? (
                <>
                  <p className="text-muted-foreground">
                    Belum ada penulis yang terdaftar. Klik tombol "Tambah
                    Penulis" untuk menambahkan.
                  </p>
                  <Button
                    onClick={() => navigate("/publish/add-author")}
                    className="mt-2"
                    variant="outline"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Tambah Penulis
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">
                    Tidak ada penulis yang sesuai dengan kriteria pencarian
                  </p>
                  <Button
                    onClick={resetSearch}
                    className="mt-2"
                    variant="outline"
                  >
                    <FilterX className="mr-2 h-4 w-4" />
                    Reset Pencarian
                  </Button>
                </>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
