import { Protected } from "@/components/app/protected";
import { Breadcrumb } from "@/components/ext/book/breadcrumb/sales";
import { Items, book as tf } from "@/components/ext/book/item-sales";
import { Error } from "@/components/ext/error";
import { MenuBarPublish } from "@/components/ext/menu-bar/publish";
import { MyBadge } from "@/components/ext/status-badge";
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
import { formatCurrency, formatDate, validate } from "@/lib/utils";
import {
  BadgeStatus,
  Role,
  type Book,
  type Product,
  type TSalesLine,
} from "backend/lib/types";

export default () => {
  const local = useLocal(
    {
      bookId: null as string | null,
      book: undefined as Book | undefined,
      productId: null as string | null,
      product: null as Partial<Product | null>,
      tSalesLine: [] as TSalesLine[],
      loading: true,
      error: "",
      totalSales: 0,
      totalItems: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
      total: 0,
      productStats: undefined as
        | {
            views: number;
            in_cart: number;
            favorite: number;
            sold_bundle: number;
            sold_standalone: number;
          }
        | undefined,
    },
    async () => {
      const params = new URLSearchParams(location.search);
      local.bookId = params.get("id");
      local.page = parseInt(params.get("page") || "1") as number;
      local.limit = parseInt(params.get("limit") || "10") as number;
      if (validate(!local.bookId, local, "ID buku tidak ditemukan.")) {
        navigate("/manage-book");
        return;
      }
      await loadData();
    }
  );

  async function loadData() {
    local.loading = true;
    local.render();

    try {
      const res = await api.book_detail({ id: local.bookId! });
      if (validate(!res.data, local, "Buku tidak ditemukan.")) {
        navigate("/manage-book");
        return;
      } else {
        local.book = res.data!;
        local.productId = local.book.id_product || null;
        local.product = local.book.product || null;

        if (local.productId) {
          // Fetch product stats
          const statsRes = await api.product_stats({ id: local.productId });
          if (statsRes.success) {
            local.productStats = statsRes.data;
          } else {
            local.productStats = undefined;
          }

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
        } else local.error = "Produk tidak ditemukan untuk buku ini.";
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
      if (line.t_sales.status === BadgeStatus.PAID) {
        // Convert Decimal to number safely
        let totalPrice = 0;
        if (typeof line.total_price === "object" && line.total_price !== null) {
          if (typeof line.total_price.toNumber === "function")
            totalPrice = line.total_price.toNumber();
          else totalPrice = Number(line.total_price);
        } else totalPrice = Number(line.total_price);
        totalSales += totalPrice;
        totalItems += line.qty;
      }
    });
    local.totalSales = totalSales;
    local.totalItems = totalItems;
  };

  return (
    <Protected role={[Role.INTERNAL]}>
      <div className="flex min-h-svh flex-col bg-gray-50">
        <MenuBarPublish />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <Error msg={local.error} loading={local.loading}>
              <div className="space-y-6">
                {/* Book details */}
                <Card>
                  <CardHeader>
                    <Breadcrumb id={local.bookId!} />
                    <CardTitle className="text-2xl">Penjualan Buku</CardTitle>
                    <CardDescription>{local.book?.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <Items item={tf(local.book!)} />
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
                    {local.productStats && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                        <div className="bg-gray-50 p-4 rounded-lg border text-center">
                          <div className="text-xs text-gray-500 mb-1">
                            Dilihat
                          </div>
                          <div className="text-lg font-semibold">
                            {local.productStats.views}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border text-center">
                          <div className="text-xs text-gray-500 mb-1">
                            Di Keranjang
                          </div>
                          <div className="text-lg font-semibold">
                            {local.productStats.in_cart}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border text-center">
                          <div className="text-xs text-gray-500 mb-1">
                            Favorit
                          </div>
                          <div className="text-lg font-semibold">
                            {local.productStats.favorite}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border text-center">
                          <div className="text-xs text-gray-500 mb-1">
                            Terjual Bundle
                          </div>
                          <div className="text-lg font-semibold">
                            {local.productStats.sold_bundle}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border text-center">
                          <div className="text-xs text-gray-500 mb-1">
                            Terjual Satuan
                          </div>
                          <div className="text-lg font-semibold">
                            {local.productStats.sold_standalone}
                          </div>
                        </div>
                      </div>
                    )}
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
                                  <MyBadge
                                    status={line.t_sales.status as BadgeStatus}
                                  />
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
            </Error>
          </div>
        </main>
      </div>
    </Protected>
  );
};
