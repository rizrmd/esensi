import { auth } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "auth_logout",
  url: "/api/auth/logout",
  async handler(arg: any, headers?: Headers): Promise<ApiResponse<void>> {
    try {
      // Use better-auth to sign out
      const response = await auth.api.signOut({
        headers: headers || new Headers(),
        asResponse: true,
      });

      // Check if sign out was successful
      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string };
        return {
          success: false,
          message: errorData.message || "Gagal keluar dari akun",
        };
      }

      return {
        success: true,
        message: "Berhasil keluar dari akun",
      };
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat keluar dari akun",
      };
    }
  },
});
