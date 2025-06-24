import type { AuthUser } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "user_get",
  url: "/api/internal/user/get",
  async handler(arg: { id: string }): Promise<ApiResponse<AuthUser>> {
    const { id } = arg;

    if (!id?.trim()) throw new Error("ID user wajib diisi");

    const user = await db.auth_user.findUnique({
      where: { id },
      include: {
        auth_account: true,
        affiliate: true,
        author: true,
        customer: true,
        publisher: true,
        internal: true,
      },
    });

    if (!user) throw new Error("User tidak ditemukan");
    return { success: true, data: user };
  },
});
