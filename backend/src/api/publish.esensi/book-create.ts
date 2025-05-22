import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { book } from "shared/models";
import type { Book } from "../types";

export default defineAPI({
  name: "book_create",
  url: "/api/publish/book/create",
  async handler(arg: { data: Partial<book> }): Promise<ApiResponse<Book>> {
    try {
      const created = await db.book.create({
        data: arg.data as any,
        include: {
          author: true,
          book_approval: {
            take: 10,
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
