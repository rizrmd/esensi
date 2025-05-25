import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "book_delete",
  url: "/api/publish/book/delete",
  async handler(arg: { id: string }): Promise<ApiResponse<void>> {
    try {
      const book = await db.book.findUnique({ where: { id: arg.id } });
      if (!book) {
        return { success: false, message: "Buku tidak ditemukan" };
      }

      await db.book.update({
        where: { id: arg.id },
        data: { deleted_at: new Date() },
      });

      return { success: true, message: "Buku berhasil dihapus" };
    } catch (error) {
      console.error("Error in book delete API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam menghapus buku",
      };
    }
  },
});
