import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { BookChangesLog } from "../../lib/types";

export default defineAPI({
  name: "book_changes_log_list",
  url: "/api/publish/book-changes-log/list",
  async handler(
    arg: {
      id_book: string;
      page?: number;
      limit?: number;
      sort?: "asc" | "desc";
    } = {
      id_book: "",
      sort: "asc",
    }
  ): Promise<ApiResponse<BookChangesLog[]>> {
    try {
      const book = await db.book.findUnique({ where: { id: arg.id_book } });

      if (!book) return { success: false, message: "Buku tidak ditemukan" };

      const page = arg.page || 1;
      const limit = arg.limit || 10;
      const skip = (page - 1) * limit;

      const total = await db.book_changes_log.count({
        where: { id_book: arg.id_book },
      });

      let log = await db.book_changes_log.findMany({
        where: { id_book: arg.id_book },
        orderBy: { created_at: arg.sort },
        skip,
        take: limit,
        include: { book: { include: { author: true } } },
      });

      log = log.map((log) => ({
        ...log,
        hash_value: `${log.id_book}_${log.created_at.getTime()}`,
      }));

      return {
        success: true,
        data: log,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error in book_changes_log list API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengambil riwayat perubahan buku",
      };
    }
  },
});
