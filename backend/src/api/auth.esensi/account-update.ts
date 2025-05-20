import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { auth_account } from "shared/models";
import type { Account } from "../types";

export default defineAPI({
  name: "account_update",
  url: "/api/publish/book/update",
  async handler(arg: {
    id: string;
    data: Partial<auth_account>;
  }): Promise<ApiResponse<Account>> {
    try {
      const account = await db.auth_account.findUnique({
        where: { id: arg.id },
      });
      if (!account) {
        return { success: false, message: "Akun tidak ditemukan" };
      }

      const updated = await db.auth_account.update({
        where: { id: arg.id },
        data: { role: arg.data.role },
        include: { auth_user: true },
      });

      return {
        success: true,
        data: updated,
        message: "Akun berhasil diperbarui",
      };
    } catch (error) {
      console.error("Error in auth_account update API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam memperbarui akun",
      };
    }
  },
});
