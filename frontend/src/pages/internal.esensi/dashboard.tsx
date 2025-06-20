import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { MenuBarInternal } from "@/components/ext/menu-bar/internal";
import { MyBadge } from "@/components/ext/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/gen/internal.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BadgeStatus, Role } from "backend/lib/types";
import {
  Award,
  BarChart3,
  Book,
  Calendar,
  DollarSign,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

interface DashboardStats {
  overview: {
    total_authors: number;
    total_books: number;
    total_customers: number;
    total_sales_count: number;
    total_sales_revenue: number;
    period_days: number;
  };
  recent_sales: Array<{
    id: string;
    qty: number;
    total_price: number;
    t_sales: {
      id: string;
      created_at: Date;
      status: string;
      customer: {
        auth_user: {
          name: string;
          email: string;
        }[];
      };
    };
    product: {
      book: Array<{
        id: string;
        name: string;
        author: {
          id: string;
          name: string;
        };
      }>;
    };
  }>;
  top_authors: Array<{
    id: string;
    name: string;
    book_count: number;
    total_sales: number;
    total_revenue: number;
  }>;
  top_books: Array<{
    id: string;
    name: string;
    author_name: string;
    total_sales: number;
    total_revenue: number;
    total_quantity: number;
  }>;
  sales_by_month: Array<{
    month: Date;
    sales_count: number;
    total_revenue: number;
  }>;
}

export default () => {
  const local = useLocal(
    {
      loading: true,
      error: "",
      stats: null as DashboardStats | null,
      selectedPeriod: "30",
    },
    async () => {
      await loadDashboardStats();
    }
  );

  const loadDashboardStats = async () => {
    try {
      local.loading = true;
      local.error = "";
      local.render();

      const result = await api.dashboard_stats({
        period: local.selectedPeriod,
      });
      if (result) {
        local.stats = result as DashboardStats;
      }
    } catch (error: any) {
      console.error("Error loading dashboard stats:", error);
      local.error =
        error.message || "Terjadi kesalahan saat memuat statistik dashboard";
    } finally {
      local.loading = false;
      local.render();
    }
  };

  const handlePeriodChange = async (value: string) => {
    local.selectedPeriod = value;
    local.render();
    await loadDashboardStats();
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
    <Protected role={[Role.INTERNAL]}>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <MenuBarInternal />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    Dashboard Internal
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Ringkasan statistik penjualan dan aktivitas platform
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Select
                    value={local.selectedPeriod}
                    onValueChange={handlePeriodChange}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 Hari Terakhir</SelectItem>
                      <SelectItem value="30">30 Hari Terakhir</SelectItem>
                      <SelectItem value="90">3 Bulan Terakhir</SelectItem>
                      <SelectItem value="365">1 Tahun Terakhir</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={loadDashboardStats}
                    disabled={local.loading}
                  >
                    {local.loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Memuat...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {local.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {local.error}
              </div>
            )}

            {local.stats && (
              <div className="space-y-8">
                {/* Overview Stats */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Penulis
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {local.stats.overview.total_authors.toLocaleString(
                          "id-ID"
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Penulis terdaftar
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Buku
                      </CardTitle>
                      <Book className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {local.stats.overview.total_books.toLocaleString(
                          "id-ID"
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Buku tersedia
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Pelanggan
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {local.stats.overview.total_customers.toLocaleString(
                          "id-ID"
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Pengguna terdaftar
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Penjualan ({local.stats.overview.period_days} hari)
                      </CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {local.stats.overview.total_sales_count.toLocaleString(
                          "id-ID"
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Transaksi berhasil
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Pendapatan ({local.stats.overview.period_days} hari)
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(
                          local.stats.overview.total_sales_revenue
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Total penjualan
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                  {/* Top Authors */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Penulis Terlaris
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {local.stats.top_authors.length > 0 ? (
                        <div className="space-y-4">
                          {local.stats.top_authors
                            .slice(0, 5)
                            .map((author, index) => (
                              <div
                                key={author.id}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {author.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {author.book_count} buku •{" "}
                                      {author.total_sales} penjualan
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold">
                                    {formatCurrency(author.total_revenue)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/author-stats")}
                            className="w-full mt-4"
                          >
                            Lihat Detail Statistik Penulis
                          </Button>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-6">
                          Belum ada data penjualan penulis
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Top Books */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Buku Terlaris
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {local.stats.top_books.length > 0 ? (
                        <div className="space-y-4">
                          {local.stats.top_books
                            .slice(0, 5)
                            .map((book, index) => (
                              <div
                                key={book.id}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">
                                      {book.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      oleh {book.author_name} •{" "}
                                      {book.total_quantity} terjual
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold">
                                    {formatCurrency(book.total_revenue)}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-6">
                          Belum ada data penjualan buku
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Sales */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Transaksi Terbaru
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {local.stats.recent_sales.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID Transaksi</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Pelanggan</TableHead>
                            <TableHead>Buku</TableHead>
                            <TableHead>Penulis</TableHead>
                            <TableHead>Jumlah</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {local.stats.recent_sales.map((sale) => (
                            <TableRow key={sale.id}>
                              <TableCell className="font-medium">
                                {sale.t_sales.id.substring(0, 8)}...
                              </TableCell>
                              <TableCell>
                                {formatDate(sale.t_sales.created_at.toString())}
                              </TableCell>
                              <TableCell>
                                {sale.t_sales.customer.auth_user[0]?.name ||
                                  "N/A"}
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                {sale.product.book[0]?.name || "N/A"}
                              </TableCell>
                              <TableCell>
                                {sale.product.book[0]?.author?.name || "N/A"}
                              </TableCell>
                              <TableCell>{sale.qty}</TableCell>
                              <TableCell>
                                {formatCurrency(sale.total_price)}
                              </TableCell>
                              <TableCell>
                                <MyBadge
                                  status={sale.t_sales.status as BadgeStatus}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground text-center py-6">
                        Belum ada transaksi terbaru
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Sales by Month */}
                {local.stats.sales_by_month.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Penjualan per Bulan (6 Bulan Terakhir)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {local.stats.sales_by_month.map((monthData) => (
                          <div
                            key={monthData.month.toString()}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <div className="font-medium">
                                {new Date(monthData.month).toLocaleDateString(
                                  "id-ID",
                                  {
                                    year: "numeric",
                                    month: "long",
                                  }
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {monthData.sales_count} transaksi
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-lg">
                                {formatCurrency(monthData.total_revenue)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </Protected>
  );
};
