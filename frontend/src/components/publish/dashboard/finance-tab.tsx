import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/router";
import type { DashboardData } from "./types";
import { formatCurrency, formatDate } from "./types";
import {
  Wallet,
  ArrowDown,
  ArrowUp,
  CreditCard,
  DollarSign,
  Calendar,
  Clock,
  Download,
  TrendingUp,
  BarChart4,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocal } from "@/lib/hooks/use-local";

interface FinanceTabProps {
  data: DashboardData;
}

export const FinanceTab = ({ data }: FinanceTabProps) => {
  const local = useLocal(
    {
      activeTab: "transactions",
    },
    async () => {
      // Initialization if needed
    }
  );

  const handleTabChange = (value: string) => {
    local.activeTab = value;
    local.render();
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "sale":
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case "withdrawal":
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      case "refund":
        return <CreditCard className="h-4 w-4 text-amber-500" />;
      default:
        return <DollarSign className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border border-green-100";
      case "pending":
        return "bg-amber-50 text-amber-700 border border-amber-100";
      case "processing":
        return "bg-blue-50 text-blue-700 border border-blue-100";
      case "rejected":
        return "bg-red-50 text-red-700 border border-red-100";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Selesai";
      case "pending":
        return "Menunggu";
      case "processing":
        return "Diproses";
      case "rejected":
        return "Ditolak";
      default:
        return status;
    }
  };

  const getCurrentMonth = () => {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const now = new Date();
    return months[now.getMonth()] + " " + now.getFullYear();
  };

  const getTransactionType = (type: string) => {
    switch (type) {
      case "sale":
        return "Penjualan";
      case "withdrawal":
        return "Penarikan";
      case "refund":
        return "Pengembalian Dana";
      default:
        return type;
    }
  };

  // Calculate total income
  const totalIncome =
    data.transactions?.transactions
      ?.filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0) || 0;

  // Calculate monthly income
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyIncome =
    data.transactions?.transactions
      ?.filter((t) => {
        const date = new Date(t.created_at);
        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear &&
          t.amount > 0
        );
      })
      .reduce((sum, t) => sum + t.amount, 0) || 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:items-start">
        <h1 className="text-2xl font-bold tracking-tight">Keuangan</h1>
        <p className="text-muted-foreground mt-1">
          Kelola pendapatan dan penarikan dana
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
              onClick={() => navigate("/publish/withdrawal")}
              className="mt-4 w-full"
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Ajukan Penarikan
            </Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">
                Pendapatan Bulan Ini
              </CardTitle>
              <BarChart4 className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(monthlyIncome)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Periode {getCurrentMonth()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">
                Total Pendapatan
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Dari semua waktu
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={local.activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="w-full max-w-md bg-muted/40 p-1">
          <TabsTrigger
            value="transactions"
            className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Riwayat Transaksi
          </TabsTrigger>
          <TabsTrigger
            value="withdrawals"
            className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Riwayat Penarikan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaksi Terbaru</CardTitle>
              <CardDescription>
                Daftar transaksi yang telah dilakukan
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {data.transactions?.transactions?.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="font-medium">
                          {getTransactionType(transaction.type)}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(transaction.created_at)}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`font-medium ${
                        transaction.amount >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.amount >= 0 ? "+" : ""}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}

                {(!data.transactions?.transactions ||
                  data.transactions.transactions.length === 0) && (
                  <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                    <CreditCard className="h-10 w-10 mb-3 opacity-30" />
                    <p>Belum ada transaksi</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Penarikan Dana</CardTitle>
              <CardDescription>
                Riwayat penarikan dana yang telah dilakukan
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {data.transactions?.withdrawals?.map((withdrawal) => (
                  <div
                    key={withdrawal.id}
                    className="p-4 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">
                        <Download className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          Penarikan
                          <Badge
                            className={`font-medium text-xs px-2 py-0.5 ${getStatusColor(
                              withdrawal.status
                            )}`}
                          >
                            {getStatusLabel(withdrawal.status)}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(withdrawal.requested_at)}
                        </div>
                      </div>
                    </div>
                    <div className="font-medium">
                      {formatCurrency(withdrawal.amount)}
                    </div>
                  </div>
                ))}

                {(!data.transactions?.withdrawals ||
                  data.transactions.withdrawals.length === 0) && (
                  <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                    <Download className="h-10 w-10 mb-3 opacity-30" />
                    <p>Belum ada penarikan dana</p>
                    <Button
                      onClick={() => navigate("/publish/withdrawal")}
                      className="mt-4"
                      variant="outline"
                      size="sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Ajukan Penarikan Dana
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
