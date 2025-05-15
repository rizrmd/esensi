import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { book_history } from "shared/models";

export default defineAPI({
  name: "book_history_list",
  url: "/api/book/history/list",
  async handler(arg: {
    book_id: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<book_history[]>> {
    try {
      // Check if book exists
      const book = await db.book.findUnique({
        where: { id: arg.book_id },
      });

      if (!book) {
        return { success: false, message: "Buku tidak ditemukan" };
      }

      const page = arg.page || 1;
      const limit = arg.limit || 10;
      const skip = (page - 1) * limit;

      const total = await db.book_history.count({
        where: {
          book_id: arg.book_id,
        },
      });

      const history = await db.book_history.findMany({
        where: {
          book_id: arg.book_id,
        },
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: limit,
      });

      return {
        success: true,
        data: history,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error in book history list API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengambil riwayat buku",
      };
    }
  },
});
