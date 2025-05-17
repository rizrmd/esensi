import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { Withdrawal } from "../types";

export default defineAPI({
  name: "withdrawal",
  url: "/api/publish/withdrawal",
  async handler(arg: {
    user: Partial<User>;
    withdrawal: {
      amount: number;
      bank_name: string;
      account_number: string;
      account_name: string;
    };
  }): Promise<ApiResponse<Withdrawal>> {
    try {
      // Get publisher ID from auth user
      const authUser = await db.auth_user.findUnique({
        where: { id: arg.user.id },
        select: { id_publisher: true },
      });

      if (!authUser?.id_publisher) {
        return {
          success: false,
          message: "Hanya penerbit yang dapat mengakses API ini",
        };
      }

      const publisherId = authUser.id_publisher;

      // Check if the amount is valid
      if (
        !arg.withdrawal.amount ||
        isNaN(arg.withdrawal.amount) ||
        arg.withdrawal.amount <= 0
      ) {
        return { success: false, message: "Jumlah penarikan tidak valid" };
      }

      // Get current balance
      const balanceResult = await db.transaction.aggregate({
        where: { id_publisher: publisherId },
        _sum: { amount: true },
      });

      const balance = balanceResult._sum.amount || 0;

      // Validate withdrawal amount against balance
      // Convert both to same type before comparison
      if (arg.withdrawal.amount > Number(balance)) {
        return {
          success: false,
          message: "Jumlah penarikan melebihi saldo tersedia",
        };
      }

      // Create withdrawal record - only using fields available in the schema
      const withdrawal = await db.withdrawal.create({
        data: {
          id_publisher: publisherId,
          amount: arg.withdrawal.amount,
          status: "pending",
          requested_at: new Date(),
        },
      });

      // Create transaction record for the withdrawal with bank details in info
      const transaction = await db.transaction.create({
        data: {
          id_publisher: publisherId,
          type: "withdrawal",
          amount: -arg.withdrawal.amount, // Negative amount for outgoing funds
          created_at: new Date(),
          info: {
            withdrawal_id: withdrawal.id,
            bank_name: arg.withdrawal.bank_name,
            account_number: arg.withdrawal.account_number,
            account_name: arg.withdrawal.account_name,
            description: `Penarikan dana ke ${arg.withdrawal.bank_name} - ${arg.withdrawal.account_number}`,
          },
        },
      });

      return {
        success: true,
        data: { withdrawal, transaction },
        message: "Permintaan penarikan berhasil dibuat",
      };
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      return {
        success: false,
        message: "Gagal memproses permintaan penarikan",
      };
    }
  },
});
