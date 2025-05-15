import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { author, bundle, category, product } from "shared/models";

export default defineAPI({
  name: "product_detail",
  url: "/api/product/detail",
  async handler(arg: { id: string }): Promise<
    ApiResponse<
      product & {
        author: author | null;
        bundle_product: { bundle: bundle }[];
        product_category: { category: category }[];
      }
    >
  > {
    try {
      const product = await db.product.findUnique({
        where: {
          id: arg.id,
        },
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

      if (!product) {
        return {
          success: false,
          message: "Produk tidak ditemukan",
        };
      }

      return {
        success: true,
        data: product,
      };
    } catch (error) {
      console.error("Error in product detail API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengambil detail produk",
      };
    }
  },
});
