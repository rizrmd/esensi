import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { Product } from "../types";

export default defineAPI({
  name: "product_detail",
  url: "/api/publish/product/detail",
  async handler(arg: { id: string }): Promise<ApiResponse<Product>> {
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
        message: "Terjadi kesalahan dalam mengambil detil produk",
      };
    }
  },
});
