import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { navigate } from "@/lib/router";
import { formatCurrency } from "./types";
import type { DashboardData, Product } from "./types";
import { BookOpen, Users, Wallet, ArrowRight, PlusCircle } from "lucide-react";

interface OverviewTabProps {
  data: DashboardData;
  isPublisher: boolean;
}

export const OverviewTab = ({ data, isPublisher }: OverviewTabProps) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ikhtisar</h1>
          <p className="text-muted-foreground mt-1">
            Lihat ringkasan aktivitas dan statistik{" "}
            {isPublisher ? "penerbit" : "penulis"} Anda
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

      {/* Summary Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">
                Total Produk
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <div className="text-2xl font-bold">
                {data.products?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                {data.products?.filter((p) => p.status === "published")
                  .length || 0}{" "}
                dipublikasikan
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-8 px-2 text-xs"
              onClick={() => navigate("products")}
            >
              <span>Lihat semua</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>

        {isPublisher && (
          <>
            <Card className="border-l-4 border-l-blue-400">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium">
                    Total Penulis
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1">
                  <div className="text-2xl font-bold">
                    {data.authors?.length || 0}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-8 px-2 text-xs"
                  onClick={() => navigate("authors")}
                >
                  <span>Kelola penulis</span>
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-400">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium">
                    Saldo Tersedia
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.transactions
                    ? formatCurrency(data.transactions.balance)
                    : "Rp 0"}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-8 px-2 text-xs"
                  onClick={() => navigate("finance")}
                >
                  <span>Kelola keuangan</span>
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent Products */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold tracking-tight">
            Produk Terbaru
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => navigate("products")}
          >
            <span>Lihat semua</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(data.products?.length > 0 ? data.products.slice(0, 6) : []).map(
            (product) => (
              <ProductCard key={product.id} product={product} />
            )
          )}

          {data.products?.length === 0 && (
            <Card className="col-span-full p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <BookOpen className="h-10 w-10 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">
                  Belum ada produk. Klik tombol "Produk Baru" untuk menambahkan.
                </p>
                <Button
                  onClick={() => navigate("/publish/new-product")}
                  className="mt-2"
                  variant="outline"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Produk Baru
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
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

  return (
    <Card
      key={product.id}
      className="overflow-hidden hover:border-primary/50 transition-colors duration-200"
    >
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
      </div>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="line-clamp-1 text-base">{product.name}</CardTitle>
        <CardDescription className="line-clamp-1 mt-1">
          {product.author?.name || ""}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-3 flex justify-between items-center">
        <Badge className={`font-medium ${statusColor}`} variant="outline">
          {product.status === "published"
            ? "Terbit"
            : product.status === "draft"
            ? "Draft"
            : product.status}
        </Badge>
        <span className="font-medium text-sm">
          {formatCurrency(product.real_price)}
        </span>
      </CardFooter>
    </Card>
  );
};
