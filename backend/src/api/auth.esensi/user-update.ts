import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { auth_user } from "shared/models";
import type { AuthUser } from "../types";

export default defineAPI({
  name: "user_update",
  url: "/api/auth/user/update",
  async handler(arg: {
    id: string;
    data: auth_user;
  }): Promise<ApiResponse<AuthUser>> {
    try {
      const author = await db.auth_user.findUnique({ where: { id: arg.id } });
      if (!author) {
        return { success: false, message: "User tidak ditemukan" };
      }

      const updated = await db.auth_user.update({
        where: { id: arg.id },
        data: arg.data as any,
        include: {
          auth_account: {
            take: 10,
          },
          affiliate: true,
          author: true,
          customer: true,
          management: true,
          publisher: true,
          sales_and_marketing: true,
          support: true,
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
