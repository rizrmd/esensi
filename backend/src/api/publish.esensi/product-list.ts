import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { author, bundle, category, product } from "shared/models";

export type Product = product & {
  author: author | null;
  bundle_product: { bundle: bundle }[];
  product_category: { category: category }[];
};

export type ProductListAPIResponse = ApiResponse<Product[]>;

export default defineAPI({
  name: "product_list",
  url: "/api/product/list",
  async handler(arg: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<ProductListAPIResponse> {
    try {
      const page = arg.page || 1;
      const limit = arg.limit || 10;
      const skip = (page - 1) * limit;
      const where: any = { deleted_at: null };

      if (arg.search) {
        where.OR = [
          { name: { contains: arg.search, mode: "insensitive" } },
          { slug: { contains: arg.search, mode: "insensitive" } },
          { desc: { contains: arg.search, mode: "insensitive" } },
        ];
      }

      if (arg.status) {
        where.status = arg.status;
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
          },
          product_category: {
            select: {
              category: true,
            },
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
