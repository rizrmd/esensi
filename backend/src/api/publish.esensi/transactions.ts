import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { Transactions } from "../types";

export default defineAPI({
  name: "transactions",
  url: "/api/publish/transactions",
  async handler(arg: {
    user: Partial<User>;
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<ApiResponse<Transactions>> {
    try {
      const page = arg.page || 1;
      const limit = arg.limit || 10;
      const skip = (page - 1) * limit;

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

      const where: any = { id_publisher: authUser.id_publisher };
      if (arg.type) {
        where.type = arg.type;
      }

      const total = await db.transaction.count({ where });

      const transaction = await db.transaction.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      });

      const result = await db.transaction.aggregate({
        where: { id_publisher: authUser.id_publisher },
        _sum: { amount: true },
      });

      const balance = result._sum.amount || 0;

      const withdrawal = await db.withdrawal.findMany({
        where: { id_publisher: authUser.id_publisher },
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
