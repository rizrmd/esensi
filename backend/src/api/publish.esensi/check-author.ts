import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "check_author",
  url: "/api/publish/check-author",
  async handler(arg: {
    user: Partial<User>;
  }): Promise<ApiResponse<{ isAuthor: boolean }>> {
    try {
      const user = await db.auth_user.findUnique({
        where: { id: arg.user.id },
        select: { id: true, id_author: true },
      });

      if (!user) {
        return {
          success: false,
          message: "Pengguna tidak ditemukan",
          data: { isAuthor: false },
        };
      }

      // Check if the user has an author ID assigned
      const isAuthor = user.id_author !== null;

      return {
        success: true,
        data: { isAuthor },
      };
    } catch (error) {
      console.error("Error checking author status:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam memeriksa status penulis",
        data: { isAuthor: false },
      };
    }
  },
});
