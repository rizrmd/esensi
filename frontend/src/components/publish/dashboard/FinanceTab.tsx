import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  betterAuth,
  type AuthClientGetSessionAPIResponse,
} from "@/lib/better-auth";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { formatCurrency, formatDateObject } from "@/lib/utils";
import type { User } from "better-auth/types";
import type { FormEvent } from "react";
import type { DashboardData } from "./types";

// Direct implementation since the API isn't properly exposed
const withdrawalApi = async (arg: {
  user: User;
  withdrawal: {
    amount: number;
    bank_name: string;
    account_number: string;
    account_name: string;
  };
}) => {
  // Call the withdrawal API endpoint directly
  const res = await api.withdrawal(arg);
  return res;
};

interface FinanceTabProps {
  data: DashboardData;
}

export const FinanceTab = ({ data }: FinanceTabProps) => {
  const { transactions } = data;

  const local = useLocal(
    {
      activeTab: "transactions",
      isWithdrawDialogOpen: false,
      withdrawAmount: "",
      withdrawBank: "",
      withdrawAccount: "",
      withdrawAccountName: "",
      isSubmitting: false,
      error: "",
      success: "",
    },
    async () => {
      local.render();
    }
  );

  const handleWithdrawal = async (e: FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(local.withdrawAmount.replace(/[^\d.-]/g, ""));

    if (!amount || isNaN(amount) || amount <= 0) {
      local.error = "Mohon masukkan jumlah penarikan yang valid";
      local.render();
      return;
    }

    if (
      !local.withdrawBank ||
      !local.withdrawAccount ||
      !local.withdrawAccountName
    ) {
      local.error = "Mohon isi semua kolom";
      local.render();
      return;
    }

    if (amount > (Number(transactions?.balance) || 0)) {
      local.error = "Jumlah penarikan melebihi saldo tersedia";
      local.render();
      return;
    }

    local.isSubmitting = true;
    local.error = "";
    local.success = "";
    local.render();

    try {
      const userInfo: AuthClientGetSessionAPIResponse =
        await betterAuth.getSession();
      if (!userInfo.data?.user) {
        local.error = "Sesi tidak valid";
        local.render();
        return;
      }

      // Use our direct implementation instead of api.withdrawal
      const result = await withdrawalApi({
        user: userInfo.data.user,
        withdrawal: {
          amount: amount,
          bank_name: local.withdrawBank,
          account_number: local.withdrawAccount,
          account_name: local.withdrawAccountName,
        },
      });

      if (result.success) {
        local.success = "Permintaan penarikan berhasil dikirim";
        local.withdrawAmount = "";
        local.withdrawBank = "";
        local.withdrawAccount = "";
        local.withdrawAccountName = "";
        local.isWithdrawDialogOpen = false;

        // Refresh transaction data
        const transactionsRes = await api.transactions({
          user: userInfo.data.user,
        });

        if (transactionsRes.success && transactionsRes.data) {
          data.transactions = transactionsRes.data;
        }
      } else {
        local.error = result.message || "Gagal melakukan penarikan";
      }
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      local.error = "Terjadi kesalahan saat memproses penarikan";
    } finally {
      local.isSubmitting = false;
      local.render();
    }
  };

  const getTransactionTypeLabel = (type: string) => {
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

  const getWithdrawalStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu";
      case "processing":
        return "Diproses";
      case "completed":
        return "Selesai";
      case "rejected":
        return "Ditolak";
      default:
        return status;
    }
  };

  const getWithdrawalStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Keuangan</h1>
        <Dialog
          open={local.isWithdrawDialogOpen}
          onOpenChange={(open) => {
            local.isWithdrawDialogOpen = open;
            local.error = "";
            local.success = "";
            local.render();
          }}
        >
          <DialogTrigger asChild>
            <Button>Tarik Dana</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tarik Dana</DialogTitle>
              <DialogDescription>
                Masukkan jumlah dan tujuan penarikan dana. Proses penarikan dana
                membutuhkan waktu 1-3 hari kerja.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleWithdrawal} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah Penarikan</Label>
                <Input
                  id="amount"
                  value={local.withdrawAmount}
                  onChange={(e) => {
                    // Only allow numbers and format as currency
                    const value = e.target.value.replace(/[^\d]/g, "");
                    if (value) {
                      local.withdrawAmount = formatCurrency(parseInt(value));
                    } else {
                      local.withdrawAmount = "";
                    }
                    local.render();
                  }}
                  placeholder="Rp 0"
                />
                <p className="text-xs text-muted-foreground">
                  Saldo tersedia:{" "}
                  {formatCurrency(Number(transactions?.balance) || 0)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank">Nama Bank</Label>
                <Input
                  id="bank"
                  value={local.withdrawBank}
                  onChange={(e) => {
                    local.withdrawBank = e.target.value;
                    local.render();
                  }}
                  placeholder="Masukkan nama bank"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account">Nomor Rekening</Label>
                <Input
                  id="account"
                  value={local.withdrawAccount}
                  onChange={(e) => {
                    local.withdrawAccount = e.target.value.replace(
                      /[^\d]/g,
                      ""
                    );
                    local.render();
                  }}
                  placeholder="Masukkan nomor rekening"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountName">Nama Pemilik Rekening</Label>
                <Input
                  id="accountName"
                  value={local.withdrawAccountName}
                  onChange={(e) => {
                    local.withdrawAccountName = e.target.value;
                    local.render();
                  }}
                  placeholder="Masukkan nama pemilik rekening"
                />
              </div>

              {local.error && (
                <p className="text-sm text-red-500">{local.error}</p>
              )}

              {local.success && (
                <p className="text-sm text-green-500">{local.success}</p>
              )}

              <DialogFooter>
                <Button type="submit" disabled={local.isSubmitting}>
                  {local.isSubmitting ? "Memproses..." : "Kirim Permintaan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saldo</CardTitle>
          <CardDescription>Saldo tersedia untuk penarikan dana</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {formatCurrency(Number(transactions?.balance) || 0)}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Penarikan dana akan diproses dalam 1-3 hari kerja
          </p>
        </CardContent>
      </Card>

      <Tabs
        value={local.activeTab}
        onValueChange={(value) => {
          local.activeTab = value;
          local.render();
        }}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="transactions">Riwayat Transaksi</TabsTrigger>
          <TabsTrigger value="withdrawals">Riwayat Penarikan</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {transactions?.transaction && transactions.transaction.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.transaction.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {formatDateObject(transaction.created_at)}
                      </TableCell>
                      <TableCell>
                        {getTransactionTypeLabel(transaction.type)}
                      </TableCell>
                      <TableCell
                        className={
                          Number(transaction.amount) > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {Number(transaction.amount) > 0 ? "+" : ""}
                        {formatCurrency(Number(transaction.amount))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="bg-muted/40 rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                Belum ada riwayat transaksi
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-4">
          {transactions?.withdrawal && transactions.withdrawal.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.withdrawal.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell>
                        {formatDateObject(withdrawal.requested_at)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(Number(withdrawal.amount))}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getWithdrawalStatusClass(
                            withdrawal.status
                          )}`}
                        >
                          {getWithdrawalStatusLabel(withdrawal.status)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="bg-muted/40 rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                Belum ada riwayat penarikan dana
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
