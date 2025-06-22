import type { User } from "backend/lib/better-auth";
import type { Bundle } from "backend/lib/types";
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
  }): Promise<ApiResponse<Bundle[]>> {
    try {
      const page = arg.page || 1;
      const limit = arg.limit || 10;
      const skip = (page - 1) * limit;

      // Get user's author ID
      const user = await db.auth_user.findUnique({
        where: { id: arg.user.id },
        select: { id_author: true },
      });

      if (!user?.id_author) {
        return {
          success: false,
          message: "Anda tidak memiliki akses sebagai penulis",
          data: [],
        };
      }

      const where: any = {
        deleted_at: null,
        // Filter bundles that contain products by this author
        bundle_product: {
          some: { product: { id_author: user.id_author } },
        },
      };

      if (arg.status) where.status = arg.status;

      if (arg.search) {
        where.OR = [
          { name: { contains: arg.search, mode: "insensitive" } },
          { slug: { contains: arg.search, mode: "insensitive" } },
          { desc: { contains: arg.search, mode: "insensitive" } },
        ];
      }

      const include: any = {};

      const total = await db.bundle.count({ where });
      const bundles = await db.bundle.findMany({
        where,
        include: {
          author: true,
          bundle_product: {
            select: {
              id: true,
              qty: true,
              product: true,
            },
          },
          bundle_category: {
            select: {
              id: true,
              category: true,
            },
          },
        },
        orderBy: { name: "asc" },
        take: limit,
        skip,
      });

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
      console.error("Error in bundle list API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengambil daftar bundle",
        data: [],
      };
    }
  },
});
