import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "bundle_update",
  url: "/api/publish/bundle/update",
  async handler(arg: {
    user: Partial<User>;
    id: string;
    name?: string;
    slug?: string;
    strike_price?: number;
    real_price?: number;
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
      const { id, categories, products, ...updateData } = arg;

      if (!id?.trim()) {
        return {
          success: false,
          message: "ID bundle wajib diisi",
        };
      }

      // Check if bundle exists
      const existingBundle = await db.bundle.findFirst({
        where: { id, deleted_at: null },
      });

      if (!existingBundle) {
        return {
          success: false,
          message: "Bundle tidak ditemukan",
        };
      }

      // Check slug uniqueness if slug is being updated
      if (updateData.slug && updateData.slug !== existingBundle.slug) {
        const slugExists = await db.bundle.findFirst({
          where: {
            slug: updateData.slug.trim(),
            id: { not: id },
            deleted_at: null,
          },
        });

        if (slugExists) {
          return {
            success: false,
            message: "Slug bundle sudah digunakan",
          };
        }
      }

      // Validate price if provided
      if (updateData.real_price !== undefined && updateData.real_price <= 0) {
        return {
          success: false,
          message: "Harga bundle harus lebih dari 0",
        };
      }

      // Build update data
      const cleanUpdateData: any = {};
      Object.keys(updateData).forEach((key) => {
        const value = (updateData as any)[key];
        if (value !== undefined) {
          if (key === "name" || key === "slug") {
            cleanUpdateData[key] = value.trim();
          } else if (key === "info") {
            // Note: cfg is intentionally excluded for authors
            cleanUpdateData[key] = value || undefined;
          } else {
            cleanUpdateData[key] = value;
          }
        }
      });

      // Update bundle with transaction
      const result = await db.$transaction(async (tx) => {
        // Update bundle data
        const updatedBundle = await tx.bundle.update({
          where: { id },
          data: cleanUpdateData,
        });

        // Update categories if provided
        if (categories !== undefined) {
          // Delete existing categories
          await tx.bundle_category.deleteMany({
            where: { id_bundle: id },
          });

          // Add new categories
          if (categories.length > 0) {
            await tx.bundle_category.createMany({
              data: categories.map((categoryId) => ({
                id_bundle: id,
                id_category: categoryId,
              })),
            });
          }
        }

        // Update products if provided
        if (products !== undefined) {
          // Delete existing products
          await tx.bundle_product.deleteMany({
            where: { id_bundle: id },
          });

          // Add new products
          if (products.length > 0) {
            await tx.bundle_product.createMany({
              data: products.map((product) => ({
                id_bundle: id,
                id_product: product.id_product,
                qty: product.qty || 1,
              })),
            });
          }
        }

        // Return updated bundle with relations
        return await tx.bundle.findUnique({
          where: { id },
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
        message: "Bundle berhasil diperbarui",
      };
    } catch (error) {
      console.error("Error in bundle update API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam memperbarui bundle",
      };
    }
  },
});
