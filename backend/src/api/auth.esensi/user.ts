import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { auth_user } from "shared/models";

export default defineAPI({
  name: "auth_user",
  url: "/api/auth/user",
  async handler(arg: { username: string }): Promise<ApiResponse<auth_user>> {
    const res = await db.auth_user.findFirst({
      where: {
        OR: [{ email: arg.username }, { username: arg.username }],
      },
    });

    if (!res) {
      return { success: false, message: "User tidak ditemukan" };
    }

    return { success: true, data: res };
  },
});
