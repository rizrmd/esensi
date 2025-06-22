import type { Bundle } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "bundle_detail",
  url: "/api/internal/bundle/:id",
  async handler(arg: { id: string }): Promise<ApiResponse<Bundle>> {
    const bundle = await db.bundle.findFirst({
      where: { id: arg.id, deleted_at: null },
      include: {
        author: true,
        bundle_product: {
          select: {
            id: true,
            qty: true,
            product: true,
          },
        },
        bundle_category: {
          select: {
            id: true,
            category: true,
          },
        },
      },
    });

    if (!bundle) return { success: false, message: "Bundle tidak ditemukan" };
    return { success: true, data: bundle };
  },
});
