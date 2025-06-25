import type { User } from "backend/lib/better-auth";
import type { BundleManagementResponse } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "bundle_category_manage",
  url: "/api/publish/bundle/category/manage",
  async handler(arg: {
    user: Partial<User>;
    id_bundle: string;
    action: "add" | "remove" | "replace";
    categories: string[];
  }): Promise<ApiResponse<BundleManagementResponse>> {
    try {
      const { id_bundle, action, categories } = arg;

      if (!id_bundle?.trim()) {
        return {
          success: false,
          message: "ID bundle wajib diisi",
        };
      }

      if (!Array.isArray(categories) || categories.length === 0) {
        return {
          success: false,
          message: "Daftar kategori wajib diisi",
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

      // Validate all categories exist
      const existingCategories = await db.category.findMany({
        where: {
          id: { in: categories },
          deleted_at: null,
        },
        select: { id: true },
      });

      if (existingCategories.length !== categories.length) {
        return {
          success: false,
          message: "Beberapa kategori tidak ditemukan atau sudah dihapus",
        };
      }

      let result;

      switch (action) {
        case "add":
          // Add categories to bundle (skip if already exists)
          const existingBundleCategories = await db.bundle_category.findMany({
            where: {
              id_bundle,
              id_category: { in: categories },
            },
            select: { id_category: true },
          });

          const existingCategoryIds = existingBundleCategories.map(
            (bc) => bc.id_category
          );
          const newCategories = categories.filter(
            (catId) => !existingCategoryIds.includes(catId)
          );

          if (newCategories.length === 0) {
            return {
              success: false,
              message: "Semua kategori sudah ada dalam bundle",
            };
          }

          await db.bundle_category.createMany({
            data: newCategories.map((categoryId) => ({
              id_bundle,
              id_category: categoryId,
            })),
          });

          result = await db.bundle.findUnique({
            where: { id: id_bundle },
            include: {
              bundle_category: {
                include: {
                  category: true,
                },
              },
            },
          });

          return {
            success: true,
            data: result!,
            message: `${newCategories.length} kategori berhasil ditambahkan ke bundle`,
          };

        case "remove":
          // Remove categories from bundle
          const deleteResult = await db.bundle_category.deleteMany({
            where: {
              id_bundle,
              id_category: { in: categories },
            },
          });

          result = await db.bundle.findUnique({
            where: { id: id_bundle },
            include: {
              bundle_category: {
                include: {
                  category: true,
                },
              },
            },
          });

          return {
            success: true,
            data: result!,
            message: `${deleteResult.count} kategori berhasil dihapus dari bundle`,
          };

        case "replace":
          // Replace all categories in bundle
          await db.$transaction(async (tx) => {
            // Delete all existing categories
            await tx.bundle_category.deleteMany({
              where: { id_bundle },
            });

            // Add new categories
            await tx.bundle_category.createMany({
              data: categories.map((categoryId) => ({
                id_bundle,
                id_category: categoryId,
              })),
            });
          });

          result = await db.bundle.findUnique({
            where: { id: id_bundle },
            include: {
              bundle_category: {
                include: {
                  category: true,
                },
              },
            },
          });

          return {
            success: true,
            data: result!,
            message: "Kategori bundle berhasil diganti",
          };

        default:
          return {
            success: false,
            message: "Aksi tidak dikenal",
          };
      }
    } catch (error) {
      console.error("Error in bundle category manage API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengelola kategori bundle",
      };
    }
  },
});
