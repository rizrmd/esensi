import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { PublishMenuBar } from "@/components/publish/menu-bar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataPagination } from "@/components/ui/data-pagination";
import { Alert } from "@/components/ui/global-alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { Role, type Book, type TSalesLine } from "backend/api/types";
import { ChevronRight } from "lucide-react";

export default () => {
  const local = useLocal(
    {
      bookId: null as string | null,
      book: null as Book | null,
      productId: null as string | null,
      product: null as any,
      tSalesLine: [] as TSalesLine[],
      loading: true,
      error: "",
      totalSales: 0,
      totalItems: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
      total: 0,
    },
    async () => {
      const params = new URLSearchParams(location.search);
      local.bookId = params.get("id");
      local.page = parseInt(params.get("page") || "1") as number;
      local.limit = parseInt(params.get("limit") || "10") as number;

      if (!local.bookId) {
        local.error = "Buku tidak ditemukan.";
        Alert.info("Buku tidak ditemukan.");
        local.loading = false;
        local.render();
        return;
      }

      await loadData();
    }
  );

  async function loadData() {
    local.loading = true;
    local.render();

    try {
      const bookRes = await api.book_detail({ id: local.bookId! });
      if (!bookRes.data) {
        local.error = "Buku tidak ditemukan.";
        Alert.info("Buku tidak ditemukan.");
      } else {
        local.book = bookRes.data;
        local.productId = local.book?.id_product || null;
        local.product = bookRes.data.product || null;

        if (local.productId) {
          const res = await api.t_sales_line_list({
            id_product: local.productId,
            page: local.page,
            limit: local.limit,
          });

          if (!res.success) {
            local.error = res.message || "Data penjualan tidak ditemukan.";
            Alert.info(local.error);
          } else {
            local.tSalesLine = res.data || [];
            local.total = res.pagination?.total || 0;
            local.page = res.pagination?.page || 1;
            local.limit = res.pagination?.limit || 10;
            local.totalPages = res.pagination?.totalPages || 0;
            calculateTotals();
          }
        } else {
          local.error = "Produk tidak ditemukan untuk buku ini.";
        }
        local.render();
      }
    } catch (error) {
      local.error = "Terjadi kesalahan saat memuat data buku.";
      Alert.info("Terjadi kesalahan saat memuat data buku.");
    } finally {
      local.loading = false;
      local.render();
    }
  }

  // Function to calculate total sales and items for the current page
  const calculateTotals = () => {
    let totalSales = 0;
    let totalItems = 0;

    local.tSalesLine.forEach((line) => {
      if (line.t_sales.status === "paid") {
        // Convert Decimal to number safely
        let totalPrice = 0;
        if (typeof line.total_price === "object" && line.total_price !== null) {
          if (typeof line.total_price.toNumber === "function") {
            totalPrice = line.total_price.toNumber();
          } else {
            totalPrice = Number(line.total_price);
          }
        } else {
          totalPrice = Number(line.total_price);
        }

        totalSales += totalPrice;
        totalItems += line.qty;
      }
    });

    local.totalSales = totalSales;
    local.totalItems = totalItems;
  };

  // Function to format currency
  const formatCurrency = (amount: any) => {
    let numAmount = 0;
    if (amount === null || amount === undefined) {
      numAmount = 0;
    } else if (typeof amount === "object") {
      if (typeof amount.toNumber === "function") {
        numAmount = amount.toNumber();
      } else {
        numAmount = Number(amount);
      }
    } else {
      numAmount = Number(amount);
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Lunas</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Menunggu Pembayaran</Badge>;
      case "cart":
        return <Badge className="bg-blue-500">Keranjang</Badge>;
      case "canceled":
        return <Badge className="bg-red-500">Dibatalkan</Badge>;
      case "expired":
        return <Badge className="bg-gray-500">Kadaluarsa</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Protected
      role={[Role.AUTHOR, Role.PUBLISHER]}
      fallback={({ missing_role }) => {
        if (
          missing_role.some((x) => x === Role.AUTHOR || x === Role.PUBLISHER)
        ) {
          navigate("/onboarding");
          return <AppLoading />;
        }
        return null;
      }}
    >
      <div className="flex min-h-svh flex-col bg-gray-50">
        <PublishMenuBar />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {local.loading ? (
              <AppLoading />
            ) : local.error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 shadow-sm">
                {local.error}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Book details */}
                <Card>
                  <CardHeader>
                    {/* Breadcrumb Navigation */}
                    <nav className="flex items-center text-sm text-gray-600 mb-4">
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
                      >
                        Beranda
                      </button>
                      <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                      <button
                        onClick={() => navigate("/manage-book")}
                        className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
                      >
                        Daftar Buku
                      </button>
                      <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                      <button
                        onClick={() =>
                          navigate("/book-step?id=" + local.bookId)
                        }
                        className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
                      >
                        Proses Buku
                      </button>
                      <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                      <span className="text-gray-800 font-medium">
                        Penjualan Buku
                      </span>
                    </nav>

                    {/* Divider line */}
                    <div className="border-b border-gray-200 mb-6"></div>

                    <CardTitle className="text-2xl">Penjualan Buku</CardTitle>
                    <CardDescription>{local.book?.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="flex flex-col space-y-2">
                        <span className="text-sm text-gray-500">Judul</span>
                        <span className="font-medium">{local.book?.name}</span>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className="text-sm text-gray-500">Penulis</span>
                        <span className="font-medium">
                          {local.book?.author?.name}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className="text-sm text-gray-500">Harga</span>
                        <span className="font-medium">
                          {formatCurrency(local.product?.real_price || 0)}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className="text-sm text-gray-500">Status</span>
                        <span className="font-medium">
                          {local.book?.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sales Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ringkasan Penjualan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <p className="text-blue-600 text-sm mb-1">
                          Total Pendapatan
                        </p>
                        <p className="text-3xl font-bold text-blue-700">
                          {formatCurrency(local.totalSales)}
                        </p>
                      </div>
                      <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                        <p className="text-green-600 text-sm mb-1">
                          Total Terjual
                        </p>
                        <p className="text-3xl font-bold text-green-700">
                          {local.totalItems} item
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sales Table */}
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle>Daftar Transaksi</CardTitle>
                      <CardDescription>
                        Semua transaksi terkait buku "{local.book?.name}"
                      </CardDescription>
                    </div>

                    {local.tSalesLine.length > 0 && (
                      <DataPagination
                        total={local.total}
                        page={local.page}
                        limit={local.limit}
                        totalPages={local.totalPages}
                        onReload={loadData}
                        onPageChange={async (newPage) => {
                          local.page = newPage;
                          local.render();
                          await loadData();
                        }}
                        onLimitChange={async (newLimit) => {
                          local.limit = newLimit;
                          local.page = 1;
                          local.render();
                          await loadData();
                        }}
                      />
                    )}
                  </CardHeader>
                  <CardContent>
                    {local.tSalesLine.length > 0 ? (
                      <>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID Transaksi</TableHead>
                              <TableHead>Tanggal</TableHead>
                              <TableHead>Jumlah</TableHead>
                              <TableHead>Harga Satuan</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {local.tSalesLine.map((line) => (
                              <TableRow key={line.id}>
                                <TableCell className="font-medium">
                                  {line.t_sales.id.substring(0, 8)}...
                                </TableCell>
                                <TableCell>
                                  {formatDate(
                                    line.t_sales.created_at.toString()
                                  )}
                                </TableCell>
                                <TableCell>{line.qty}</TableCell>
                                <TableCell>
                                  {formatCurrency(line.unit_price)}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(line.total_price)}
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(line.t_sales.status)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        <div className="mt-6 flex justify-end">
                          <DataPagination
                            total={local.total}
                            page={local.page}
                            limit={local.limit}
                            totalPages={local.totalPages}
                            onReload={loadData}
                            onPageChange={async (newPage) => {
                              local.page = newPage;
                              local.render();
                              await loadData();
                            }}
                            onLimitChange={async (newLimit) => {
                              local.limit = newLimit;
                              local.page = 1;
                              local.render();
                              await loadData();
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">
                          Belum ada transaksi untuk buku ini
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </Protected>
  );
};
