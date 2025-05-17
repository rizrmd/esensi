import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "publisher_author_delete",
  url: "/api/publish/publisher-author/delete",
  async handler(arg: {
    user: Partial<User>;
    author_id: string;
  }): Promise<ApiResponse<void>> {
    try {
      // Get publisher ID from auth user
      const authUser = await db.auth_user.findUnique({
        where: { id: arg.user.id },
        select: { id_publisher: true },
      });

      if (!authUser?.id_publisher) {
        return {
          success: false,
          message: "Hanya penerbit yang dapat mengakses API ini",
        };
      }

      // Delete the relationship
      await db.publisher_author.deleteMany({
        where: {
          publisher_id: authUser.id_publisher,
          author_id: arg.author_id,
        },
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
