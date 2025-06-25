import type { User } from "backend/lib/better-auth";
import type { BundleGetResponse } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "bundle_get",
  url: "/api/internal/bundle/get",
  async handler(arg: {
    user: Partial<User>;
    id: string;
    include_categories?: boolean;
    include_products?: boolean;
  }): Promise<ApiResponse<BundleGetResponse>> {
    try {
      const { id, include_categories = false, include_products = false } = arg;

      if (!id?.trim()) {
        return {
          success: false,
          message: "ID bundle wajib diisi",
        };
      }

      const bundle = await db.bundle.findFirst({
        where: { id, deleted_at: null },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          bundle_category: include_categories
            ? {
                include: {
                  category: true,
                },
              }
            : false,
          bundle_product: include_products
            ? {
                include: {
                  product: {
                    include: {
                      author: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
              }
            : false,
        },
      });

      if (!bundle) {
        return {
          success: false,
          message: "Bundle tidak ditemukan",
        };
      }

      return {
        success: true,
        data: bundle,
      };
    } catch (error) {
      console.error("Error getting bundle:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat mengambil data bundle",
      };
    }
  },
});
