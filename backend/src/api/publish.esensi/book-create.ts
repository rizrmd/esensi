import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { author, book, book_history } from "shared/models";

export type BookCreateAPIResponse = ApiResponse<
  book & { author: author | null; book_history: book_history[] }
>;

export default defineAPI({
  name: "book_create",
  url: "/api/book/create",
  async handler(arg: { data: Partial<book> }): Promise<BookCreateAPIResponse> {
    try {
      // Create book directly with the provided data
      const created = await db.book.create({
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
        data: created,
        message: "Buku berhasil ditambahkan",
      };
    } catch (error) {
      console.error("Error in book create API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam menambahkan buku",
      };
    }
  },
});
