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

interface OverviewTabProps {
  data: DashboardData;
  isPublisher: boolean;
}

export const OverviewTab = ({ data, isPublisher }: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ikhtisar</h1>
        <Button onClick={() => navigate("/publish/new-product")}>
          + Produk Baru
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.products?.length || 0}
            </div>
          </CardContent>
        </Card>

        {isPublisher && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Penulis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.authors?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Saldo Tersedia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.transactions
                    ? formatCurrency(data.transactions.balance)
                    : "Rp 0"}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent Products */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Produk Terbaru</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(data.products?.length > 0 ? data.products.slice(0, 6) : []).map(
            (product) => (
              <ProductCard key={product.id} product={product} />
            )
          )}

          {data.products?.length === 0 && (
            <Card className="col-span-full p-6 text-center">
              <p className="text-muted-foreground">
                Belum ada produk. Klik tombol "Produk Baru" untuk menambahkan.
              </p>
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
  return (
    <Card key={product.id} className="overflow-hidden">
      <div className="aspect-[4/3] relative">
        {product.cover && (
          <img
            src={`https://esensi.online/${product.cover.replace(
              "_file/",
              "_img/"
            )}?w=300`}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1 text-md">{product.name}</CardTitle>
        <CardDescription className="line-clamp-1">
          {product.author?.name || ""}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Badge
          variant={
            product.status === "published"
              ? "default"
              : product.status === "draft"
              ? "outline"
              : "secondary"
          }
        >
          {product.status === "published"
            ? "Terbit"
            : product.status === "draft"
            ? "Draft"
            : product.status}
        </Badge>
        <span className="font-medium">
          {formatCurrency(product.real_price)}
        </span>
      </CardFooter>
    </Card>
  );
};
