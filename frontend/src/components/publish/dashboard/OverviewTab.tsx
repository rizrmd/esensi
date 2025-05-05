import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/router";
import type { DashboardData } from "./types";
import { BookOpen, Download, Users } from "lucide-react";

interface OverviewTabProps {
  data: DashboardData;
  isPublisher: boolean;
}

export const OverviewTab = ({ data, isPublisher }: OverviewTabProps) => {
  const { products, authors, transactions } = data;
  
  // Calculate statistics
  const totalProducts = products?.length || 0;
  const publishedProducts = products?.filter(p => p.status === "published").length || 0;
  const totalAuthors = authors?.length || 0;
  const totalBalance = transactions?.balance || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Ikhtisar</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate("/publish.esensi/create-book")}>
            Terbitkan Buku Baru
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {publishedProducts} sudah diterbitkan
            </p>
          </CardContent>
        </Card>
        
        {isPublisher && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Penulis</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAuthors}</div>
              <p className="text-xs text-muted-foreground">
                Klik untuk kelola penulis
              </p>
            </CardContent>
          </Card>
        )}
        
        {isPublisher && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Saldo</CardTitle>
              <Download className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rp {totalBalance.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-muted-foreground">
                Klik untuk tarik dana
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Produk Terbaru</h2>
        {products && products.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map(product => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-[3/4] relative bg-muted">
                  {product.cover && (
                    <img
                      src={product.cover}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {product.author?.name}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Rp {product.real_price.toLocaleString('id-ID')}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      product.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {product.status === "published" ? "Terbit" : "Draft"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
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
    </div>
  );
};