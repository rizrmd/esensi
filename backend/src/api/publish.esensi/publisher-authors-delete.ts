import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "publisher_author_delete",
  url: "/api/publish/publisher-author/delete",
  async handler(arg: { id: string }): Promise<ApiResponse<void>> {
    try {
      await db.publisher_author.delete({
        where: { id: arg.id },
      });

      return {
        success: true,
        message: "Penulis berhasil dihapus dari penerbit",
      };
    } catch (error) {
      console.error("Error managing publisher authors:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengelola ikatan penulis-penerbit",
      };
    }
  },
});
