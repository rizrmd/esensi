import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { TSalesLine } from "../../lib/types";

export default defineAPI({
  name: "t_sales_line_list",
  url: "/api/publish/t-sales-line/list",
  async handler(arg: {
    id_product: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<TSalesLine[]>> {
    try {
      const page = arg.page || 1;
      const limit = arg.limit || 10;
      const skip = (page - 1) * limit;

      // Count total records
      const total = await db.t_sales_line.count({
        where: {
          id_product: arg.id_product,
        },
      });

      const detail = await db.t_sales_line.findMany({
        where: {
          id_product: arg.id_product,
        },
        include: {
          t_sales: true,
          product: true,
          bundle: true,
        },
        skip,
        take: limit,
      });

      if (!detail)
        return {
          success: false,
          message: "Transaction sales line tidak ditemukan",
        };

      return {
        success: true,
        data: detail,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error in t_sales_line detail API:", error);
      return {
        success: false,
        message:
          "Terjadi kesalahan dalam mengambil detail transaction sales line",
      };
    }
  },
});
