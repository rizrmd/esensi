import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { chapter } from "shared/models";

export default defineAPI({
  name: "chapter_updates",
  url: "/api/publish/chapter/updates",
  async handler(arg: { data: chapter[] }): Promise<ApiResponse<number>> {
    try {
      for (const item of arg.data) {
        await db.chapter.update({
          where: { id: item.id },
          data: {
            number: item.number,
            name: item.name,
            content: item.content!,
          },
        });
      }

      return {
        success: true,
        data: arg.data.length,
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
