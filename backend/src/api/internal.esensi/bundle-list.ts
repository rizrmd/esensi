import type { User } from "backend/lib/better-auth";
import type { Bundle } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "bundle_list",
  url: "/api/internal/bundle/list",
  async handler(arg: {
    user: Partial<User>;
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<Bundle[]>> {
    try {
      const page = arg.page || 1;
      const limit = arg.limit || 10;
      const skip = (page - 1) * limit;

      const where: any = { deleted_at: null };

      if (arg.status) where.status = arg.status;

      if (arg.search)
        where.name = { contains: arg.search, mode: "insensitive" };

      const include: any = { author: true };

      const [bundles, total] = await Promise.all([
        db.bundle.findMany({
          where,
          include: {
            author: true,
            bundle_product: { select: { id: true, qty: true, product: true } },
            bundle_category: { select: { id: true, category: true } },
          },
          skip,
          take: limit,
          orderBy: { name: "asc" },
        }),
        db.bundle.count({ where }),
      ]);

      return {
        success: true,
        data: bundles,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error in bundle_list:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat mengambil data bundle",
        data: [],
      };
    }
  },
});
