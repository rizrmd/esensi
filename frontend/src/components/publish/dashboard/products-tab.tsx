import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { navigate } from "@/lib/router";
import type { FormEvent } from "react";
import type { DashboardData, Product } from "./types";
import { ProductCard } from "./overview-tab";
import { useLocal } from "@/lib/hooks/use-local";
import { Search, BookOpen, PlusCircle, Pencil, FilterX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductsTabProps {
  data: DashboardData;
}

export const ProductsTab = ({ data }: ProductsTabProps) => {
  const local = useLocal(
    {
      searchQuery: "",
      searchResults: [] as Product[],
      isSearching: false,
      statusFilter: "all" as string,
    },
    async () => {
      // Optional async initialization if needed
    }
  );

  const handleSearchChange = (value: string) => {
    local.searchQuery = value;
    local.render();
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();

    local.isSearching = true;
    local.render();

    try {
      // Search functionality with filtering
      let filtered = data.products;

      // Apply search query if exists
      if (local.searchQuery.trim()) {
        filtered = filtered.filter((product) =>
          product.name.toLowerCase().includes(local.searchQuery.toLowerCase())
        );
      }

      // Apply status filter if not 'all'
      if (local.statusFilter !== "all") {
        filtered = filtered.filter(
          (product) => product.status === local.statusFilter
        );
      }

      local.searchResults = filtered;
    } catch (error) {
      console.error("Error searching products:", error);
      local.searchResults = [];
    } finally {
      local.isSearching = false;
      local.render();
    }
  };

  const setStatusFilter = (status: string) => {
    local.statusFilter = status;
    handleSearch({ preventDefault: () => {} } as any);
  };

  const resetFilters = () => {
    local.searchQuery = "";
    local.statusFilter = "all";
    local.searchResults = [];
    local.render();
  };

  const getFilteredProducts = () => {
    if (local.searchQuery || local.statusFilter !== "all") {
      return local.searchResults;
    }
    return data.products || [];
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daftar Produk</h1>
          <p className="text-muted-foreground mt-1">
            Kelola dan publikasikan produk Anda
          </p>
        </div>
        <Button
          onClick={() => navigate("/publish/new-product")}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Produk Baru</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-auto flex-1">
          <form className="relative" onSubmit={handleSearch}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama produk..."
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

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={local.statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
            className="h-10"
          >
            Semua
          </Button>
          <Button
            size="sm"
            variant={local.statusFilter === "published" ? "default" : "outline"}
            onClick={() => setStatusFilter("published")}
            className="h-10"
          >
            Terbit
          </Button>
          <Button
            size="sm"
            variant={local.statusFilter === "draft" ? "default" : "outline"}
            onClick={() => setStatusFilter("draft")}
            className="h-10"
          >
            Draft
          </Button>

          {(local.searchQuery || local.statusFilter !== "all") && (
            <Button
              size="sm"
              variant="ghost"
              onClick={resetFilters}
              className="h-10 gap-2"
            >
              <FilterX className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Results info */}
      {(local.searchQuery || local.statusFilter !== "all") && (
        <div className="flex items-center text-sm text-muted-foreground">
          <span>
            Menampilkan {getFilteredProducts().length} produk
            {local.searchQuery && ` untuk "${local.searchQuery}"`}
            {local.statusFilter !== "all" &&
              ` dengan status "${
                local.statusFilter === "published" ? "Terbit" : "Draft"
              }"`}
          </span>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {getFilteredProducts().map((product) => (
          <ProductCardWithEdit key={product.id} product={product} />
        ))}

        {getFilteredProducts().length === 0 && (
          <Card className="col-span-full p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <BookOpen className="h-10 w-10 text-muted-foreground opacity-30" />
              {data.products?.length === 0 ? (
                <>
                  <p className="text-muted-foreground">
                    Belum ada produk. Klik tombol "Produk Baru" untuk
                    menambahkan.
                  </p>
                  <Button
                    onClick={() => navigate("/publish/new-product")}
                    className="mt-2"
                    variant="outline"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Produk Baru
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">
                    Tidak ada produk yang sesuai dengan kriteria pencarian
                  </p>
                  <Button
                    onClick={resetFilters}
                    className="mt-2"
                    variant="outline"
                  >
                    <FilterX className="mr-2 h-4 w-4" />
                    Reset Filter
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

// Extended version of ProductCard with edit button
interface ProductCardWithEditProps {
  product: Product;
}

export const ProductCardWithEdit = ({ product }: ProductCardWithEditProps) => {
  const statusColors = {
    published: "bg-green-50 text-green-700 border border-green-200",
    draft: "bg-amber-50 text-amber-700 border border-amber-200",
    pending: "bg-blue-50 text-blue-700 border border-blue-200",
  };

  const statusColor =
    product.status === "published"
      ? statusColors.published
      : product.status === "draft"
      ? statusColors.draft
      : statusColors.pending;

  const statusLabel =
    product.status === "published"
      ? "Terbit"
      : product.status === "draft"
      ? "Draft"
      : product.status;

  return (
    <Card className="overflow-hidden group hover:border-primary/50 transition-colors duration-200">
      <div className="aspect-[3/4] relative bg-gray-100">
        {product.cover ? (
          <img
            src={`https://esensi.online/${product.cover.replace(
              "_file/",
              "_img/"
            )}?w=300`}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full text-muted-foreground">
            <BookOpen className="h-12 w-12 opacity-20" />
          </div>
        )}
        <Badge className={`absolute top-3 right-3 ${statusColor}`}>
          {statusLabel}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="font-medium line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
          {product.author?.name || ""}
        </p>
      </div>
      <div className="p-4 pt-0 border-t mt-2">
        <Button
          variant="outline"
          className="w-full group-hover:bg-primary/5 group-hover:border-primary/50 transition-colors duration-200"
          onClick={() => navigate(`/publish/edit-product/${product.id}`)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Produk
        </Button>
      </div>
    </Card>
  );
};
