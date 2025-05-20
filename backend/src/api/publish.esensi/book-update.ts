import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { book } from "shared/models";
import type { Book } from "../types";

export default defineAPI({
  name: "book_update",
  url: "/api/publish/book/update",
  async handler(arg: {
    id: string;
    data: Partial<book>;
  }): Promise<ApiResponse<Book>> {
    try {
      const book = await db.book.findUnique({ where: { id: arg.id } });
      if (!book) {
        return { success: false, message: "Buku tidak ditemukan" };
      }

      const updated = await db.book.update({
        where: { id: arg.id },
        data: {
          name: arg.data.name,
          slug: arg.data.slug,
          alias: arg.data.alias,
          submitted_price: arg.data.submitted_price,
          desc: arg.data.desc,
          info: arg.data.info ?? {},
          status: arg.data.status,
          currency: arg.data.currency,
          img_file: arg.data.img_file,
          cover: arg.data.cover,
          product_file: arg.data.product_file,
          sku: arg.data.sku,
          id_author: arg.data.id_author,
          is_physical: arg.data.is_physical,
          content_type: arg.data.content_type,
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
