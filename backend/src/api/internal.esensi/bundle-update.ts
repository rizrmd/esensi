import type { User } from "backend/lib/better-auth";
import type { BundleUpdateResponse } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "bundle_update",
  url: "/api/internal/bundle/update",
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
    cfg?: string;
    categories?: string[];
    products?: Array<{ id_product: string; qty?: number }>;
    id_author?: string;
  }): Promise<ApiResponse<BundleUpdateResponse>> {
    try {
      const {
        id,
        name,
        slug,
        strike_price,
        real_price,
        currency,
        desc,
        info,
        status,
        img_file,
        cover,
        sku,
        cfg,
        categories,
        products,
        id_author,
      } = arg;

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

      // Validate author exists if specified
      if (id_author) {
        const author = await db.author.findFirst({
          where: { id: id_author },
        });

        if (!author) {
          return {
            success: false,
            message: "Author tidak ditemukan",
          };
        }
      }

      // Check if slug already exists (excluding current bundle)
      if (slug && slug !== existingBundle.slug) {
        const existingSlug = await db.bundle.findFirst({
          where: { slug, deleted_at: null, id: { not: id } },
        });

        if (existingSlug) {
          return {
            success: false,
            message: "Slug bundle sudah digunakan",
          };
        }
      }

      // Check if SKU already exists (excluding current bundle)
      if (sku && sku !== existingBundle.sku) {
        const existingSku = await db.bundle.findFirst({
          where: { sku, deleted_at: null, id: { not: id } },
        });

        if (existingSku) {
          return {
            success: false,
            message: "SKU bundle sudah digunakan",
          };
        }
      }

      // Validate products if provided
      if (products && products.length > 0) {
        const productIds = products.map((p) => p.id_product);
        const validProducts = await db.product.findMany({
          where: {
            id: { in: productIds },
            deleted_at: null,
            status: "published", // Only published products can be added to bundles
          },
        });

        if (validProducts.length !== productIds.length) {
          return {
            success: false,
            message: "Beberapa produk tidak valid atau belum dipublikasikan",
          };
        }
      }

      // Update bundle and related data in a transaction
      const result = await db.$transaction(async (tx) => {
        // Prepare update data
        const updateData: any = {
          updated_at: new Date(),
        };

        if (name !== undefined) updateData.name = name;
        if (slug !== undefined) updateData.slug = slug;
        if (strike_price !== undefined) updateData.strike_price = strike_price;
        if (real_price !== undefined) updateData.real_price = real_price;
        if (currency !== undefined) updateData.currency = currency;
        if (desc !== undefined) updateData.desc = desc;
        if (info !== undefined) updateData.info = info;
        if (status !== undefined) updateData.status = status;
        if (img_file !== undefined) updateData.img_file = img_file;
        if (cover !== undefined) updateData.cover = cover;
        if (sku !== undefined) updateData.sku = sku;
        if (cfg !== undefined) updateData.cfg = cfg;
        if (id_author !== undefined) updateData.id_author = id_author;

        // Update bundle
        const bundle = await tx.bundle.update({
          where: { id },
          data: updateData,
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
                created_at: new Date(),
                updated_at: new Date(),
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
                created_at: new Date(),
                updated_at: new Date(),
              })),
            });
          }
        }

        return bundle;
      });

      return {
        success: true,
        message: "Bundle berhasil diperbarui",
        data: result,
      };
    } catch (error) {
      console.error("Error updating bundle:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat memperbarui bundle",
      };
    }
  },
});
