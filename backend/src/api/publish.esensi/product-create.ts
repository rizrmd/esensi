import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { product } from "shared/models";

export default defineAPI({
  name: "product_create",
  url: "/api/product/create",
  async handler(arg: {
    user: Partial<User>;
    data: product;
  }): Promise<ApiResponse<product>> {
    try {
      // Create product directly with the provided data
      const created = await db.product.create({
        data: arg.data as any,
      });

      return {
        success: true,
        data: created,
        message: "Produk berhasil ditambahkan",
      };
    } catch (error) {
      console.error("Error in products create API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam menambahkan produk",
      };
    }
  },
});
