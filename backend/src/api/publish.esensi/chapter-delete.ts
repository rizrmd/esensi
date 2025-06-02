import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "chapter_delete",
  url: "/api/publish/chapter/delete",
  async handler(arg: { ids: string[] }): Promise<ApiResponse<number>> {
    try {
      const deleted = await db.chapter.deleteMany({
        where: { id: { in: arg.ids } },
      });

      return {
        success: true,
        data: deleted.count,
        message: "Chapter berhasil dihapus",
      };
    } catch (error) {
      console.error("Error in chapter delete API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam menghapus chapter",
      };
    }
  },
});
