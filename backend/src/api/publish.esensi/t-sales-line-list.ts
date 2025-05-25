import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { TSalesLine } from "../types";

export default defineAPI({
  name: "t_sales_line_list",
  url: "/api/publish/t-sales-line/list",
  async handler(arg: {
    id_product: string;
  }): Promise<ApiResponse<TSalesLine[]>> {
    try {
      const detail = await db.t_sales_line.findMany({
        where: {
          id_product: arg.id_product,
        },
        include: {
          t_sales: true,
          product: true,
          bundle: true,
        },
      });

      if (!detail)
        return {
          success: false,
          message: "Transaction sales line tidak ditemukan",
        };

      return {
        success: true,
        data: detail,
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
