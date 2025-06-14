import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { chapter } from "shared/models";
import type { Chapter } from "../../lib/types";

export default defineAPI({
  name: "chapter_create",
  url: "/api/publish/chapter/create",
  async handler(arg: { data: chapter }): Promise<ApiResponse<Chapter>> {
    try {
      const created = await db.chapter.create({
        data: {
          id_book: arg.data.id_book,
          id_product: arg.data.id_product,
          number: arg.data.number,
          name: arg.data.name,
          content: arg.data.content!,
        },
        include: {
          book: true,
          product: true,
        },
      });

      return {
        success: true,
        data: created,
        message: "Chapter berhasil ditambahkan",
      };
    } catch (error) {
      console.error("Error in chapter create API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam menambahkan chapter",
      };
    }
  },
});
