import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "bundle_delete",
  url: "/api/internal/bundle/delete",
  async handler(arg: {
    user: Partial<User>;
    id: string;
    hard_delete?: boolean;
  }): Promise<ApiResponse<void>> {
    try {
      const { id, hard_delete = false } = arg;

      if (!id?.trim()) {
        return {
          success: false,
          message: "ID bundle wajib diisi",
        };
      }

      // Check if bundle exists
      const existingBundle = await db.bundle.findFirst({
        where: { id, deleted_at: null },
        include: {
          t_sales_line: true,
        },
      });

      if (!existingBundle) {
        return {
          success: false,
          message: "Bundle tidak ditemukan",
        };
      }

      // Check if bundle has sales
      if (existingBundle.t_sales_line.length > 0) {
        return {
          success: false,
          message:
            "Tidak dapat menghapus bundle yang sudah memiliki transaksi penjualan",
        };
      }

      if (hard_delete) {
        // Hard delete: remove bundle and all relations
        await db.$transaction(async (tx) => {
          // Delete bundle categories
          await tx.bundle_category.deleteMany({
            where: { id_bundle: id },
          });

          // Delete bundle products
          await tx.bundle_product.deleteMany({
            where: { id_bundle: id },
          });

          // Delete bundle
          await tx.bundle.delete({
            where: { id },
          });
        });
      } else {
        // Soft delete: set deleted_at timestamp
        await db.bundle.update({
          where: { id },
          data: {
            deleted_at: new Date(),
          },
        });
      }

      return {
        success: true,
        message: hard_delete
          ? "Bundle berhasil dihapus permanen"
          : "Bundle berhasil dihapus",
      };
    } catch (error) {
      console.error("Error deleting bundle:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat menghapus bundle",
      };
    }
  },
});
