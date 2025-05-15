import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { book } from "shared/models";

export default defineAPI({
  name: "book_detail",
  url: "/api/book/detail",
  async handler(arg: { id: string }): Promise<ApiResponse<book>> {
    try {
      const book = await db.book.findUnique({
        where: {
          id: arg.id,
          deleted_at: null,
        },
      });

      if (!book) {
        return {
          success: false,
          message: "Buku tidak ditemukan",
        };
      }

      return {
        success: true,
        data: book,
      };
    } catch (error) {
      console.error("Error in book detail API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengambil detail buku",
      };
    }
  },
});
