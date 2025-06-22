import type { Affiliate } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "affiliate_get",
  url: "/api/internal/affiliate/get",
  async handler(arg: { id: string }): Promise<ApiResponse<Affiliate>> {
    const { id } = arg;

    if (!id?.trim()) throw new Error("ID affiliate wajib diisi");

    const affiliate = await db.affiliate.findUnique({
      where: { id },
      include: { auth_user: true, auth_account: true },
    });

    if (!affiliate) throw new Error("Affiliate tidak ditemukan");
    return { success: true, data: affiliate };
  },
});
