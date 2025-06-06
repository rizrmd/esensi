import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { chapter } from "shared/models";

export default defineAPI({
  name: "chapter_creates",
  url: "/api/publish/chapter/creates",
  async handler(arg: { data: chapter[] }): Promise<ApiResponse<number>> {
    try {
      const created = await db.chapter.createMany({
        data: arg.data.map((item) => ({
          id_book: item.id_book,
          id_product: item.id_product,
          number: item.number,
          name: item.name,
          content: item.content!,
        })),
      });

      return {
        success: true,
        data: created.count,
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
