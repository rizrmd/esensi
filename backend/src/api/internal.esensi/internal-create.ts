import type { ApiResponse } from "backend/lib/utils";
import type { InternalListItem } from "../../lib/types";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "internal_create",
  url: "/api/internal/internal/create",
  async handler(arg: {
    name: string;
    is_sales_and_marketing?: boolean;
    is_support?: boolean;
    is_management?: boolean;
    is_it?: boolean;
    id_account?: string;
    id_user?: string;
  }): Promise<ApiResponse<InternalListItem>> {
    const {
      name,
      is_sales_and_marketing = false,
      is_support = false,
      is_management = false,
      is_it = false,
      id_account,
      id_user,
    } = arg;

    // Validate required fields
    if (!name?.trim()) throw new Error("Nama internal wajib diisi");

    // Check if internal with same name already exists
    const existing = await db.internal.findFirst({
      where: { name: name.trim() },
    });

    if (existing) throw new Error("Internal dengan nama tersebut sudah ada");

    const result = await db.internal.create({
      data: {
        name: name.trim(),
        is_sales_and_marketing,
        is_support,
        is_management,
        is_it,
        id_account: id_account || null,
        id_user: id_user || null,
      },
      include: {
        auth_user: true,
        auth_account: true,
        book_approval: true,
      },
    });

    return {
      success: true,
      data: result,
    };
  },
});
