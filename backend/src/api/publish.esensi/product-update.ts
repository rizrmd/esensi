import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { product } from "shared/models";

export default defineAPI({
  name: "product_update",
  url: "/api/product/update",
  async handler(arg: {
    id: string;
    data: product;
  }): Promise<ApiResponse<product>> {
    try {
      // Check if product exists
      const product = await db.product.findUnique({ where: { id: arg.id } });
      if (!product) {
        return { success: false, message: "Produk tidak ditemukan" };
      }

      const updated = await db.product.update({
        where: { id: arg.id },
        data: arg.data as any,
      });

      return {
        success: true,
        data: updated,
        message: "Produk berhasil diperbarui",
      };
    } catch (error) {
      console.error("Error in products update API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam memperbarui produk",
      };
    }
  },
});
