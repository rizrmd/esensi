import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { product } from "shared/models";
import type { Product } from "../types";

export default defineAPI({
  name: "product_update",
  url: "/api/publish/product/update",
  async handler(arg: {
    id: string;
    data: product;
  }): Promise<ApiResponse<Product>> {
    try {
      // Check if product exists
      const product = await db.product.findUnique({ where: { id: arg.id } });
      if (!product) {
        return { success: false, message: "Produk tidak ditemukan" };
      }

      const updated = await db.product.update({
        where: { id: arg.id },
        data: arg.data as any,
        include: {
          author: true,
          bundle_product: {
            select: {
              bundle: true,
            },
            take: 10,
          },
          product_category: {
            select: {
              category: true,
            },
            take: 10,
          },
        },
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
