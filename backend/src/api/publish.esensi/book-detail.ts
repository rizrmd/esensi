import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { Book } from "../types";

export default defineAPI({
  name: "book_detail",
  url: "/api/publish/book/detail",
  async handler(arg: { id: string }): Promise<ApiResponse<Book>> {
    try {
      const book = await db.book.findUnique({
        where: {
          id: arg.id,
        },
        include: {
          author: true,
          book_approval: {
            orderBy: {
              created_at: "desc",
            },
          },
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
