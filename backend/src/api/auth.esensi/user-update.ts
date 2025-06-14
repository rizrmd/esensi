import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { AuthUser } from "../../lib/types";

export default defineAPI({
  name: "user_update",
  url: "/api/auth/user/update",
  async handler(arg: {
    id: string;
    data: User;
  }): Promise<ApiResponse<AuthUser>> {
    try {
      const user = await db.auth_user.findUnique({ where: { id: arg.id } });
      if (!user) {
        return { success: false, message: "User tidak ditemukan" };
      }

      const updated = await db.auth_user.update({
        where: { id: arg.id },
        data: {
          id_affiliate: arg.data.idAffiliate,
          id_author: arg.data.idAuthor,
          id_customer: arg.data.idCustomer,
          id_internal: arg.data.idInternal,
          id_publisher: arg.data.idPublisher,
          name: arg.data.name,
          image: arg.data.image,
          email: arg.data.email,
          email_verified: arg.data.emailVerified,
        },
        include: {
          auth_account: {
            take: 10,
          },
          affiliate: true,
          author: true,
          customer: true,
          internal: true,
          publisher: true,
          auth_session: true,
          auth_two_factor: true,
        },
      });

      return {
        success: true,
        data: updated,
        message: "User berhasil diperbarui",
      };
    } catch (error) {
      console.error("Error in auth_user update API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam memperbarui user",
      };
    }
  },
});
