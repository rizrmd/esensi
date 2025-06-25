import type { User } from "backend/lib/better-auth";
import type { BundleManagementResponse } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "bundle_product_manage",
  url: "/api/publish/bundle/product/manage",
  async handler(arg: {
    user: Partial<User>;
    id_bundle: string;
    action: "add" | "remove" | "update" | "replace";
    products: Array<{ id_product: string; qty?: number }>;
  }): Promise<ApiResponse<BundleManagementResponse>> {
    try {
      const { id_bundle, action, products } = arg;

      if (!id_bundle?.trim()) {
        return {
          success: false,
          message: "ID bundle wajib diisi",
        };
      }

      if (!Array.isArray(products) || products.length === 0) {
        return {
          success: false,
          message: "Daftar produk wajib diisi",
        };
      }

      // Check if bundle exists
      const bundle = await db.bundle.findFirst({
        where: { id: id_bundle, deleted_at: null },
      });

      if (!bundle) {
        return {
          success: false,
          message: "Bundle tidak ditemukan",
        };
      }

      // Validate all products exist
      const productIds = products.map((p) => p.id_product);
      const existingProducts = await db.product.findMany({
        where: {
          id: { in: productIds },
          deleted_at: null,
        },
        select: { id: true },
      });

      if (existingProducts.length !== productIds.length) {
        return {
          success: false,
          message: "Beberapa produk tidak ditemukan atau sudah dihapus",
        };
      }

      let result;

      switch (action) {
        case "add":
          // Add products to bundle (skip if already exists)
          const existingBundleProducts = await db.bundle_product.findMany({
            where: {
              id_bundle,
              id_product: { in: productIds },
            },
            select: { id_product: true },
          });

          const existingProductIds = existingBundleProducts.map(
            (bp) => bp.id_product
          );
          const newProducts = products.filter(
            (p) => !existingProductIds.includes(p.id_product)
          );

          if (newProducts.length === 0) {
            return {
              success: false,
              message: "Semua produk sudah ada dalam bundle",
            };
          }

          await db.bundle_product.createMany({
            data: newProducts.map((product) => ({
              id_bundle,
              id_product: product.id_product,
              qty: product.qty || 1,
            })),
          });

          result = await db.bundle.findUnique({
            where: { id: id_bundle },
            include: {
              bundle_product: {
                include: {
                  product: {
                    include: {
                      author: true,
                    },
                  },
                },
              },
            },
          });

          return {
            success: true,
            data: result!,
            message: `${newProducts.length} produk berhasil ditambahkan ke bundle`,
          };

        case "remove":
          // Remove products from bundle
          const deleteResult = await db.bundle_product.deleteMany({
            where: {
              id_bundle,
              id_product: { in: productIds },
            },
          });

          result = await db.bundle.findUnique({
            where: { id: id_bundle },
            include: {
              bundle_product: {
                include: {
                  product: {
                    include: {
                      author: true,
                    },
                  },
                },
              },
            },
          });

          return {
            success: true,
            data: result!,
            message: `${deleteResult.count} produk berhasil dihapus dari bundle`,
          };

        case "update":
          // Update quantity of existing products
          for (const product of products) {
            await db.bundle_product.updateMany({
              where: {
                id_bundle,
                id_product: product.id_product,
              },
              data: {
                qty: product.qty || 1,
              },
            });
          }

          result = await db.bundle.findUnique({
            where: { id: id_bundle },
            include: {
              bundle_product: {
                include: {
                  product: {
                    include: {
                      author: true,
                    },
                  },
                },
              },
            },
          });

          return {
            success: true,
            data: result!,
            message: "Kuantitas produk berhasil diperbarui",
          };

        case "replace":
          // Replace all products in bundle
          await db.$transaction(async (tx) => {
            // Delete all existing products
            await tx.bundle_product.deleteMany({
              where: { id_bundle },
            });

            // Add new products
            await tx.bundle_product.createMany({
              data: products.map((product) => ({
                id_bundle,
                id_product: product.id_product,
                qty: product.qty || 1,
              })),
            });
          });

          result = await db.bundle.findUnique({
            where: { id: id_bundle },
            include: {
              bundle_product: {
                include: {
                  product: {
                    include: {
                      author: true,
                    },
                  },
                },
              },
            },
          });

          return {
            success: true,
            data: result!,
            message: "Produk bundle berhasil diganti",
          };

        default:
          return {
            success: false,
            message: "Aksi tidak dikenal",
          };
      }
    } catch (error) {
      console.error("Error in bundle product manage API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengelola produk bundle",
      };
    }
  },
});
