import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export type ProductDeleteAPIResponse = ApiResponse<void>;

export default defineAPI({
  name: "product_delete",
  url: "/api/product/delete",
  async handler(arg: { id: string }): Promise<ProductDeleteAPIResponse> {
    try {
      // Check if product exists
      const product = await db.product.findUnique({ where: { id: arg.id } });
      if (!product) {
        return { success: false, message: "Produk tidak ditemukan" };
      }

      await db.product.update({
        where: { id: arg.id },
        data: { deleted_at: new Date() },
      });

      return {
        success: true,
        message: "Produk berhasil dihapus",
      };
    } catch (error) {
      console.error("Error in products delete API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam menghapus produk",
      };
    }
  },
});
