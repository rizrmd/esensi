import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { transaction, withdrawal } from "shared/models";
import type { Decimal } from "shared/models/runtime/library";

export type TransactionAPIResponse = ApiResponse<{
  transaction: transaction[];
  balance: number | Decimal;
  withdrawal: withdrawal[];
}>;

export default defineAPI({
  name: "transactions",
  url: "/api/transactions",
  async handler(arg: {
    user: Partial<User>;
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<TransactionAPIResponse> {
    try {
      const page = arg.page || 1;
      const limit = arg.limit || 10;
      const skip = (page - 1) * limit;

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

      // Build query conditionals
      const where: any = { id_publisher: publisherId };

      // Filter by type if provided
      if (arg.type) {
        where.type = arg.type;
      }

      // Get total count for pagination
      const total = await db.transaction.count({ where });

      // Get paginated results
      const transaction = await db.transaction.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      });

      // Get total balance
      const result = await db.transaction.aggregate({
        where: { id_publisher: publisherId },
        _sum: { amount: true },
      });

      const balance = result._sum.amount || 0;

      // Also get withdrawal information
      const withdrawal = await db.withdrawal.findMany({
        where: { id_publisher: publisherId },
        orderBy: { requested_at: "desc" },
        take: 5,
      });

      return {
        success: true,
        data: {
          transaction,
          balance,
          withdrawal,
        },
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return { success: false, message: "Gagal mengambil data transaksi" };
    }
  },
});
