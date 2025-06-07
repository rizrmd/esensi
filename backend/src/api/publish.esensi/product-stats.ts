// API to fetch product statistics: views, cart, favorite, sold as bundle/standalone

import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "product_stats",
  url: "/api/publish/product/stats",
  async handler(arg: { id: string }): Promise<
    ApiResponse<{
      views: number;
      in_cart: number;
      favorite: number;
      sold_bundle: number;
      sold_standalone: number;
    }>
  > {
    try {
      const id = arg.id;

      // Views: count customer_reader for this product
      const views = await db.customer_reader.count({
        where: { id_product: id },
      });

      // In cart: count t_sales_line joined with t_sales where status is "cart"
      const in_cart = await db.t_sales_line.count({
        where: {
          id_product: id,
          t_sales: { status: "cart" },
        },
      });

      // Favorite: not tracked in schema, return 0 (placeholder)
      const favorite = 0;

      // Sold as bundle: t_sales_line with id_product and id_bundle not null, t_sales status "paid" or "completed"
      const sold_bundle = await db.t_sales_line.count({
        where: {
          id_product: id,
          id_bundle: { not: null },
          t_sales: { status: { in: ["paid", "completed"] } },
        },
      });

      // Sold as standalone: t_sales_line with id_product and id_bundle null, t_sales status "paid" or "completed"
      const sold_standalone = await db.t_sales_line.count({
        where: {
          id_product: id,
          id_bundle: null,
          t_sales: { status: { in: ["paid", "completed"] } },
        },
      });

      return {
        success: true,
        data: {
          views,
          in_cart,
          favorite,
          sold_bundle,
          sold_standalone,
        },
      };
    } catch (error) {
      console.error("Error in product stats API:", error);
      return {
        success: false,
        message: "Gagal mengambil statistik produk",
      };
    }
  },
});
