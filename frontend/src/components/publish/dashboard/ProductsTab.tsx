import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { navigate } from "@/lib/router";
import type { DashboardData } from "./types";
import { useLocal } from "@/lib/hooks/use-local";
import type { FormEvent } from "react";
import { MoreHorizontal } from "lucide-react";

interface ProductsTabProps {
  data: DashboardData;
}

export const ProductsTab = ({ data }: ProductsTabProps) => {
  const { products } = data;

  const local = useLocal({
    searchQuery: "",
    filteredProducts: products || [],
    currentFilter: "all"
  }, async () => {
    local.filteredProducts = products || [];
    local.render();
  });

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    
    if (!products) return;
    
    if (local.searchQuery.trim() === "") {
      local.filteredProducts = filterByStatus(products, local.currentFilter);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(local.searchQuery.toLowerCase())
      );
      local.filteredProducts = filterByStatus(filtered, local.currentFilter);
    }
    
    local.render();
  };

  const filterByStatus = (items: any[], status: string) => {
    if (status === "all") return items;
    return items.filter(item => item.status === status);
  };

  const applyFilter = (status: string) => {
    local.currentFilter = status;
    local.filteredProducts = filterByStatus(products || [], status);
    local.render();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Terbit</Badge>;
      case "draft":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Draft</Badge>;
      case "review":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Sedang Ditinjau</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Produk</h1>
        <Button onClick={() => navigate("/publish.esensi/create-book")}>
          Terbitkan Buku Baru
        </Button>
      </div>
      
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Input
            placeholder="Cari produk..."
            value={local.searchQuery}
            onChange={e => {
              local.searchQuery = e.target.value;
              local.render();
            }}
            className="w-full"
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="sm" 
            className="absolute right-0 top-0 h-full"
          >
            Cari
          </Button>
        </form>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={local.currentFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => applyFilter("all")}
          >
            Semua
          </Button>
          <Button 
            variant={local.currentFilter === "published" ? "default" : "outline"}
            size="sm"
            onClick={() => applyFilter("published")}
          >
            Terbit
          </Button>
          <Button 
            variant={local.currentFilter === "draft" ? "default" : "outline"}
            size="sm"
            onClick={() => applyFilter("draft")}
          >
            Draft
          </Button>
        </div>
      </div>
      
      {/* Products table */}
      {local.filteredProducts && local.filteredProducts.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Cover</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Penulis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {local.filteredProducts.map(product => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-16 h-20 bg-muted rounded">
                      {product.cover && (
                        <img 
                          src={product.cover} 
                          alt={product.name} 
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.author?.name}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>Rp {product.real_price.toLocaleString('id-ID')}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Aksi</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/publish.esensi/edit-book/${product.id}`)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/publish.esensi/preview-book/${product.id}`)}>
                          Pratinjau
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-muted/40 rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-4">Belum ada produk yang diterbitkan</p>
          <Button onClick={() => navigate("/publish.esensi/create-book")}>
            Terbitkan Buku Baru
          </Button>
        </div>
      )}
    </div>
  );
};