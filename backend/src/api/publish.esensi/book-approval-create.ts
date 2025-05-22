import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { BookApproval } from "../types";

export default defineAPI({
  name: "book_approval_create",
  url: "/api/publish/book-approval/create",
  async handler(arg: {
    id_book: string;
    comment: string;
  }): Promise<ApiResponse<BookApproval>> {
    try {
      const book = await db.book.findUnique({ where: { id: arg.id_book } });
      if (!book) {
        return { success: false, message: "Buku tidak ditemukan" };
      }

      const created = await db.book_approval.create({
        data: {
          id_book: arg.id_book,
          comment: arg.comment,
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
      console.error("Error in book approval create API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam menambahkan riwayat buku",
      };
    }
  },
});
