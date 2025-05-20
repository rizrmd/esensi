import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { product } from "shared/models";
import type { Product } from "../types";

export default defineAPI({
  name: "product_create",
  url: "/api/publish/product/create",
  async handler(arg: {
    user: Partial<User>;
    data: product;
  }): Promise<ApiResponse<Product>> {
    try {
      // Create product directly with the provided data
      const created = await db.product.create({
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
