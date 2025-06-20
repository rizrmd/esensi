import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "bundle_list",
  url: "/api/publish/bundle/list",
  async handler(arg: {
    user: Partial<User>;
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    include_categories?: boolean;
    include_products?: boolean;
  }): Promise<ApiResponse<any[]>> {
    try {
      const page = arg.page || 1;
      const limit = arg.limit || 10;
      const skip = (page - 1) * limit;
      const where: any = { deleted_at: null };

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

      const include: any = {};

      if (arg.include_categories) {
        include.bundle_category = {
          include: {
            category: true,
          },
        };
      }

      if (arg.include_products) {
        include.bundle_product = {
          include: {
            product: {
              include: {
                author: true,
              },
            },
          },
        };
      }

      const total = await db.bundle.count({ where });
      const bundles = await db.bundle.findMany({
        where,
        include,
        orderBy: { name: "asc" },
        take: limit,
        skip,
      });

      return {
        success: true,
        data: bundles,
        message: "Daftar bundle berhasil diambil",
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error in bundle list API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengambil daftar bundle",
        data: [],
      };
    }
  },
});
