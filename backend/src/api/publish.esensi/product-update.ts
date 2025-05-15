import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { author, bundle, category, product } from "shared/models";

export default defineAPI({
  name: "product_update",
  url: "/api/product/update",
  async handler(arg: { id: string; data: product }): Promise<
    ApiResponse<
      product & {
        author: author | null;
        bundle_product: { bundle: bundle }[];
        product_category: { category: category }[];
      }
    >
  > {
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
          },
          product_category: {
            select: {
              category: true,
            },
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
