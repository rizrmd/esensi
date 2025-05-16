import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { author, book, book_history } from "shared/models";

export type BookDetailAPIResponse = ApiResponse<
  book & { author: author | null; book_history: book_history[] }
>;

export default defineAPI({
  name: "book_detail",
  url: "/api/book/detail",
  async handler(arg: { id: string }): Promise<BookDetailAPIResponse> {
    try {
      const book = await db.book.findUnique({
        where: {
          id: arg.id,
        },
        include: {
          author: true,
          book_history: {
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
