import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { navigate } from "@/lib/router";
import type { FormEvent } from "react";
import type { DashboardData, Product } from "./types";
import { ProductCard } from "./overview-tab";
import { SimpleLineIconsPencil } from "@/components/icons/SimpleLineIconsPencil";
import { useLocal } from "@/lib/hooks/use-local";

interface ProductsTabProps {
  data: DashboardData;
}

export const ProductsTab = ({ data }: ProductsTabProps) => {
  const local = useLocal({
    searchQuery: "",
    searchResults: [] as Product[],
    isSearching: false,
  }, async () => {
    // Optional async initialization if needed
  });

  const handleSearchChange = (value: string) => {
    local.searchQuery = value;
    local.render();
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!local.searchQuery.trim()) return;
    
    local.isSearching = true;
    local.render();
    
    try {
      // Search functionality
      const filtered = data.products.filter(product => 
        product.name.toLowerCase().includes(local.searchQuery.toLowerCase())
      );
      local.searchResults = filtered;
    } catch (error) {
      console.error("Error searching products:", error);
      local.searchResults = [];
    } finally {
      local.isSearching = false;
      local.render();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Daftar Produk</h1>
        <form 
          className="flex w-full sm:w-auto gap-2"
          onSubmit={handleSearch}
        >
          <Input
            placeholder="Cari produk..."
            value={local.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="sm:w-[250px]"
          />
          <Button type="submit" disabled={local.isSearching}>
            {local.isSearching ? "Mencari..." : "Cari"}
          </Button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {((local.searchQuery && local.searchResults.length > 0) ? 
          local.searchResults : 
          data.products || []
        ).map((product) => (
          <ProductCardWithEdit key={product.id} product={product} />
        ))}
        
        {data.products?.length === 0 && (
          <Card className="col-span-full p-6 text-center">
            <p className="text-muted-foreground">
              Belum ada produk. Klik tombol "Produk Baru" untuk menambahkan.
            </p>
          </Card>
        )}
        
        {local.searchQuery && local.searchResults.length === 0 && (
          <Card className="col-span-full p-6 text-center">
            <p className="text-muted-foreground">
              Tidak ada hasil untuk pencarian "{local.searchQuery}"
            </p>
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
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] relative">
        {product.cover && (
          <img
            src={`https://esensi.online/${product.cover.replace("_file/", "_img/")}?w=300`}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        )}
      </div>
      <ProductCard product={product} />
      <div className="p-4 pt-0 border-t">
        <Button variant="outline" className="w-full" onClick={() => navigate(`/publish/edit-product/${product.id}`)}>
          <SimpleLineIconsPencil className="mr-2" />
          Edit Produk
        </Button>
      </div>
    </Card>
  );
};