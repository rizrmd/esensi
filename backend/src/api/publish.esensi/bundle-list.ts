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
          some: {
            product: {
              id_author: user.id_author
            }
          }
        }
      };

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
          select: {
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        };
      }

      if (arg.include_products) {
        include.bundle_product = {
          select: {
            id: true,
            qty: true,
            product: {
              select: {
                id: true,
                name: true,
                real_price: true,
                currency: true,
                cover: true,
                author: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        };
      }

      const total = await db.bundle.count({ where });
      const bundles = await db.bundle.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          desc: true,
          real_price: true,
          strike_price: true,
          currency: true,
          status: true,
          cover: true,
          img_file: true,
          info: true,
          sku: true,
          // Note: cfg is intentionally excluded for authors
          ...include
        },
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
