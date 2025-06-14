import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { product } from "shared/models";
import type { Product } from "../../lib/types";

export default defineAPI({
  name: "product_update",
  url: "/api/publish/product/update",
  async handler(arg: {
    id: string;
    data: Partial<product>;
  }): Promise<ApiResponse<Product>> {
    try {
      const product = await db.product.findUnique({ where: { id: arg.id } });
      if (!product) {
        return { success: false, message: "Produk tidak ditemukan" };
      }

      const updated = await db.product.update({
        where: { id: arg.id },
        data: {
          name: arg.data.name,
          slug: arg.data.slug,
          alias: arg.data.alias,
          strike_price: arg.data.strike_price,
          real_price: arg.data.real_price,
          desc: arg.data.desc,
          info: arg.data.info ?? {},
          status: arg.data.status,
          currency: arg.data.currency,
          img_file: arg.data.img_file,
          cover: arg.data.cover,
          product_file: arg.data.product_file,
          sku: arg.data.sku,
          id_author: arg.data.id_author,
          is_physical: arg.data.is_physical,
          content_type: arg.data.content_type,
        },
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
