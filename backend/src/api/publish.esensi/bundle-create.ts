import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "bundle_create",
  url: "/api/publish/bundle/create",
  async handler(arg: {
    user: Partial<User>;
    name: string;
    slug: string;
    strike_price?: number;
    real_price: number;
    currency?: string;
    desc?: string;
    info?: Record<string, any>;
    status?: string;
    img_file?: string;
    cover?: string;
    sku?: string;
    // Note: cfg is intentionally excluded for authors
    categories?: string[];
    products?: Array<{ id_product: string; qty?: number }>;
  }): Promise<ApiResponse<any>> {
    try {
      const {
        name,
        slug,
        strike_price,
        real_price,
        currency = "Rp.",
        desc = "",
        info = {},
        status = "draft",
        img_file = "[]",
        cover = "",
        sku = "",
        // Note: cfg is intentionally excluded for authors
        categories = [],
        products = [],
      } = arg;

      // Validate required fields
      if (!name?.trim()) {
        return {
          success: false,
          message: "Nama bundle wajib diisi",
        };
      }

      if (!slug?.trim()) {
        return {
          success: false,
          message: "Slug bundle wajib diisi",
        };
      }

      if (!real_price || real_price <= 0) {
        return {
          success: false,
          message: "Harga bundle harus lebih dari 0",
        };
      }

      // Check if slug already exists
      const existingBundle = await db.bundle.findFirst({
        where: { slug: slug.trim() },
      });

      if (existingBundle) {
        return {
          success: false,
          message: "Slug bundle sudah digunakan",
        };
      }

      // Create bundle with transaction
      const result = await db.$transaction(async (tx) => {
        // Create bundle
        const bundle = await tx.bundle.create({
          data: {
            name: name.trim(),
            slug: slug.trim(),
            strike_price: strike_price || null,
            real_price,
            currency,
            desc,
            info,
            status,
            img_file,
            cover,
            sku,
            // Note: cfg is intentionally excluded for authors
          },
        });

        // Add categories if provided
        if (categories.length > 0) {
          await tx.bundle_category.createMany({
            data: categories.map((categoryId) => ({
              id_bundle: bundle.id,
              id_category: categoryId,
            })),
          });
        }

        // Add products if provided
        if (products.length > 0) {
          await tx.bundle_product.createMany({
            data: products.map((product) => ({
              id_bundle: bundle.id,
              id_product: product.id_product,
              qty: product.qty || 1,
            })),
          });
        }

        // Return bundle with relations
        return await tx.bundle.findUnique({
          where: { id: bundle.id },
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
            bundle_category: {
              select: {
                category: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            },
            bundle_product: {
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
            }
          }
        });
      });

      return {
        success: true,
        data: result,
        message: "Bundle berhasil dibuat",
      };
    } catch (error) {
      console.error("Error in bundle create API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam membuat bundle",
      };
    }
  },
});
