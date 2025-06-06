import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { chapter } from "shared/models";
import type { Chapter } from "../types";

export default defineAPI({
  name: "chapter_update",
  url: "/api/publish/chapter/update",
  async handler(arg: { id: string; data: chapter }): Promise<ApiResponse<Chapter>> {
    try {
      const updated = await db.chapter.update({
        where: { id: arg.id },
        data: {
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
        data: updated,
        message: "Chapter berhasil diperbarui",
      };
    } catch (error) {
      console.error("Error in chapter update API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam memperbarui chapter",
      };
    }
  },
});
