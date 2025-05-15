import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { book } from "shared/models";

export default defineAPI({
  name: "book_create",
  url: "/api/book/create",
  async handler(arg: { data: Partial<book> }): Promise<ApiResponse<book>> {
    try {
      // Create book directly with the provided data
      const created = await db.book.create({
        data: arg.data as any,
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
