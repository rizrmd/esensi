import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { PublisherAuthor } from "../types";

export default defineAPI({
  name: "publisher_author_list",
  url: "/api/publish/publisher-author/list",
  async handler(arg: {
    user: Partial<User>;
  }): Promise<ApiResponse<PublisherAuthor[]>> {
    try {
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

      // List all authors associated with this publisher
      const pa = await db.publisher_author.findMany({
        where: { publisher_id: authUser.id_publisher },
        include: {
          author: {
            include: {
              auth_account: true,
              auth_user: true,
              book: true,
              product: true,
            },
          },
        },
      });

      return {
        success: true,
        data: pa,
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
