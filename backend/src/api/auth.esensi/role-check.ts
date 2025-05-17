import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { RoleCheck } from "../types";

export default defineAPI({
  name: "role_check",
  url: "/api/auth/role-check",
  async handler(arg: {
    user: Partial<User>;
    role: (
      | "affiliate"
      | "author"
      | "customer"
      | "management"
      | "publisher"
      | "sales_and_marketing"
      | "support"
    )[];
  }): Promise<ApiResponse<RoleCheck | null>> {
    try {
      const user = await db.auth_user.findUnique({
        where: { id: arg.user.id },
      });

      if (!user) {
        return {
          success: false,
          message: "Pengguna tidak ditemukan",
          data: null,
        };
      }

      const roles: RoleCheck = {};
      for (const role of arg.role) {
        roles.affiliate = role === "affiliate" && user.id_affiliate !== null;
        roles.author = role === "author" && user.id_author !== null;
        roles.customer = role === "customer" && user.id_customer !== null;
        roles.management = role === "management" && user.id_management !== null;
        roles.publisher = role === "publisher" && user.id_publisher !== null;
        roles.sales_and_marketing =
          role === "sales_and_marketing" &&
          user.id_sales_and_marketing !== null;
        roles.support = role === "support" && user.id_support !== null;
      }

      return {
        success: true,
        data: { ...roles },
      };
    } catch (error) {
      console.error("Error checking user role:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam memeriksa role pengguna",
        data: null,
      };
    }
  },
});
