import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "bundle_get",
  url: "/api/publish/bundle/get",
  async handler(arg: {
    user: Partial<User>;
    id?: string;
    slug?: string;
    include_categories?: boolean;
    include_products?: boolean;
    include_sales?: boolean;
  }): Promise<ApiResponse<any>> {
    try {
      const {
        id,
        slug,
        include_categories = true,
        include_products = true,
        include_sales = false,
      } = arg;

      if (!id && !slug) {
        return {
          success: false,
          message: "ID atau slug bundle wajib diisi",
        };
      }

      const where: any = { deleted_at: null };
      if (id) {
        where.id = id;
      } else if (slug) {
        where.slug = slug;
      }

      const include: any = {};

      if (include_categories) {
        include.bundle_category = {
          include: {
            category: true,
          },
        };
      }

      if (include_products) {
        include.bundle_product = {
          include: {
            product: {
              include: {
                author: true,
                product_category: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        };
      }

      if (include_sales) {
        include.t_sales_line = {
          include: {
            t_sales: {
              include: {
                customer: true,
              },
            },
          },
          take: 10,
          orderBy: {
            t_sales: {
              created_at: "desc",
            },
          },
        };
      }

      const bundle = await db.bundle.findFirst({
        where,
        include,
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
        message: "Bundle berhasil diambil",
      };
    } catch (error) {
      console.error("Error in bundle get API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengambil bundle",
      };
    }
  },
});
