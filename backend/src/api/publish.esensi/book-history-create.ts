import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { BookHistory } from "../types";

export default defineAPI({
  name: "book_history_create",
  url: "/api/publish/book-history/create",
  async handler(arg: {
    book_id: string;
    description: string;
  }): Promise<ApiResponse<BookHistory>> {
    try {
      const book = await db.book.findUnique({ where: { id: arg.book_id } });
      if (!book) {
        return { success: false, message: "Buku tidak ditemukan" };
      }

      const created = await db.book_history.create({
        data: {
          book_id: arg.book_id,
          description: arg.description,
        },
        include: {
          book: true,
        },
      });

      return {
        success: true,
        data: created,
        message: "Riwayat buku berhasil ditambahkan",
      };
    } catch (error) {
      console.error("Error in book history create API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam menambahkan riwayat buku",
      };
    }
  },
});
