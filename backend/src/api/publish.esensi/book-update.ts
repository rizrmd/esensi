import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { book } from "shared/models";

export default defineAPI({
  name: "book_update",
  url: "/api/book/update",
  async handler(arg: { id: string; data: book }): Promise<ApiResponse<book>> {
    try {
      // Check if book exists
      const book = await db.book.findUnique({ where: { id: arg.id } });
      if (!book) {
        return { success: false, message: "Buku tidak ditemukan" };
      }

      const updated = await db.book.update({
        where: { id: arg.id },
        data: arg.data as any,
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
