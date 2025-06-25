import type { User } from "backend/lib/better-auth";
import type { BundleCreateResponse } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "bundle_create",
  url: "/api/internal/bundle/create",
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
    cfg?: string;
    categories?: string[];
    products?: Array<{ id_product: string; qty?: number }>;
    id_author?: string; // For internal use - can specify which author the bundle belongs to
  }): Promise<ApiResponse<BundleCreateResponse>> {
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
        cfg,
        categories = [],
        products = [],
        id_author,
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

      if (!sku?.trim()) {
        return {
          success: false,
          message: "SKU bundle wajib diisi",
        };
      }

      // Validate author exists if specified
      let authorId = id_author;
      if (!authorId) {
        return {
          success: false,
          message: "ID Author wajib diisi untuk bundle internal",
        };
      }

      const author = await db.author.findFirst({
        where: { id: authorId },
      });

      if (!author) {
        return {
          success: false,
          message: "Author tidak ditemukan",
        };
      }

      // Check if slug already exists
      const existingBundle = await db.bundle.findFirst({
        where: { slug, deleted_at: null },
      });

      if (existingBundle) {
        return {
          success: false,
          message: "Slug bundle sudah digunakan",
        };
      }

      // Check if SKU already exists
      const existingSku = await db.bundle.findFirst({
        where: { sku, deleted_at: null },
      });

      if (existingSku) {
        return {
          success: false,
          message: "SKU bundle sudah digunakan",
        };
      }

      // Validate products if provided
      if (products.length > 0) {
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

      // Create bundle and related data in a transaction
      const result = await db.$transaction(async (tx) => {
        // Create bundle
        const bundle = await tx.bundle.create({
          data: {
            name,
            slug,
            strike_price: strike_price || 0,
            real_price,
            currency,
            desc,
            info,
            status,
            img_file,
            cover,
            sku,
            cfg,
            id_author: authorId,
            created_at: new Date(),
          },
        });

        // Add categories if provided
        if (categories.length > 0) {
          await tx.bundle_category.createMany({
            data: categories.map((categoryId) => ({
              id_bundle: bundle.id,
              id_category: categoryId,
              created_at: new Date(),
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
              created_at: new Date(),
            })),
          });
        }

        return bundle;
      });

      return {
        success: true,
        message: "Bundle berhasil dibuat",
        data: result,
      };
    } catch (error) {
      console.error("Error creating bundle:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat membuat bundle",
      };
    }
  },
});
