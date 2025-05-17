import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { book } from "shared/models";
import type { Book } from "../types";

export default defineAPI({
  name: "book_update",
  url: "/api/publish/book/update",
  async handler(arg: { id: string; data: book }): Promise<ApiResponse<Book>> {
    try {
      const book = await db.book.findUnique({ where: { id: arg.id } });
      if (!book) {
        return { success: false, message: "Buku tidak ditemukan" };
      }

      const updated = await db.book.update({
        where: { id: arg.id },
        data: arg.data as any,
        include: {
          author: true,
          book_history: {
            orderBy: {
              created_at: "desc",
            },
          },
        },
      });

      return {
        success: true,
        data: updated,
        message: "Buku berhasil diperbarui",
      };
    } catch (error) {
      console.error("Error in book update API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam memperbarui buku",
      };
    }
  },
});
