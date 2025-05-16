import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { author, book, book_history } from "shared/models";

export type BookUpdateAPIResponse = ApiResponse<
  book & { author: author | null; book_history: book_history[] }
>;

export default defineAPI({
  name: "book_update",
  url: "/api/book/update",
  async handler(arg: {
    id: string;
    data: book;
  }): Promise<BookUpdateAPIResponse> {
    try {
      // Check if book exists
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
