import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { auth_user } from "shared/models";
import type { AuthUser } from "../types";

export default defineAPI({
  name: "user_detail",
  url: "/api/auth/user/detail",
  async handler(arg: {
    id: string;
    data: auth_user;
  }): Promise<ApiResponse<AuthUser>> {
    try {
      const user = await db.auth_user.findUnique({
        where: { id: arg.id },
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

      if (!user) {
        return { success: false, message: "User tidak ditemukan" };
      }

      return {
        success: true,
        data: user,
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
