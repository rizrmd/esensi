import type { User } from "backend/lib/better-auth";
import type { ProductListResponse } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "product_list",
  url: "/api/internal/product/list",
  async handler(arg: {
    user: Partial<User>;
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    id_author?: string;
  }): Promise<ApiResponse<ProductListResponse>> {
    try {
      const {
        page = 1,
        limit = 50,
        search = "",
        status = "",
        id_author = "",
      } = arg;

      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {
        deleted_at: null,
      };

      // Add search filter
      if (search.trim()) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { desc: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ];
      }

      // Add status filter
      if (status.trim()) {
        where.status = status;
      }

      // Add author filter
      if (id_author.trim()) {
        where.id_author = id_author;
      }

      // Get total count
      const total = await db.product.count({ where });

      // Get products
      const products = await db.product.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { id: "desc" },
        skip,
        take: limit,
      });

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          products,
          pagination: {
            page,
            limit,
            total,
            totalPages,
          },
        },
      };
    } catch (error) {
      console.error("Error getting product list:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat mengambil daftar produk",
      };
    }
  },
});
