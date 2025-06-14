import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { Product } from "../../lib/types";

export default defineAPI({
  name: "product_list",
  url: "/api/publish/product/list",
  async handler(arg: {
    page?: number;
    limit?: number;
    id_author?: string;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<Product[]>> {
    try {
      const page = arg.page || 1;
      const limit = arg.limit || 10;
      const skip = (page - 1) * limit;
      const where: any = { deleted_at: null };

      if (arg.id_author) {
        where.id_author = arg.id_author;
      }

      if (arg.status) {
        where.status = arg.status;
      }

      if (arg.search) {
        where.OR = [
          { name: { contains: arg.search, mode: "insensitive" } },
          { slug: { contains: arg.search, mode: "insensitive" } },
          { desc: { contains: arg.search, mode: "insensitive" } },
        ];
      }

      const total = await db.product.count({ where });
      const product = await db.product.findMany({
        where,
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
        orderBy: {
          published_date: "desc",
        },
        skip,
        take: limit,
      });

      return {
        success: true,
        data: product,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error in products list API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengambil daftar produk",
      };
    }
  },
});
