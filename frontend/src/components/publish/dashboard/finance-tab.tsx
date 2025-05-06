import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/router";
import type { DashboardData } from "./types";
import { formatCurrency, formatDate } from "./types";

interface FinanceTabProps {
  data: DashboardData;
}

export const FinanceTab = ({ data }: FinanceTabProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Keuangan</h1>

      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle>Saldo Tersedia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-4">
            {data.transactions
              ? formatCurrency(data.transactions.balance)
              : "Rp 0"}
          </div>
          <Button onClick={() => navigate("/publish/withdrawal")}>
            Ajukan Penarikan
          </Button>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Transaksi Terbaru</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {data.transactions?.transactions?.map((transaction) => (
                <div key={transaction.id} className="p-4 flex justify-between">
                  <div>
                    <div className="font-medium">{transaction.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(transaction.created_at)}
                    </div>
                  </div>
                  <div
                    className={`font-medium ${
                      transaction.amount >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}

              {(!data.transactions?.transactions ||
                data.transactions.transactions.length === 0) && (
                <div className="p-4 text-center text-muted-foreground">
                  Belum ada transaksi
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Withdrawals */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Penarikan Terbaru</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {data.transactions?.withdrawals?.map((withdrawal) => (
                <div key={withdrawal.id} className="p-4 flex justify-between">
                  <div>
                    <div className="font-medium">
                      Penarikan{" "}
                      <Badge
                        variant={
                          withdrawal.status === "completed"
                            ? "default"
                            : withdrawal.status === "pending"
                            ? "outline"
                            : withdrawal.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {withdrawal.status === "completed"
                          ? "Selesai"
                          : withdrawal.status === "pending"
                          ? "Menunggu"
                          : withdrawal.status === "rejected"
                          ? "Ditolak"
                          : withdrawal.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(withdrawal.requested_at)}
                    </div>
                  </div>
                  <div className="font-medium">
                    {formatCurrency(withdrawal.amount)}
                  </div>
                </div>
              ))}

              {(!data.transactions?.withdrawals ||
                data.transactions.withdrawals.length === 0) && (
                <div className="p-4 text-center text-muted-foreground">
                  Belum ada penarikan
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
