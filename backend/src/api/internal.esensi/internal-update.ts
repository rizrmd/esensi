import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "internal_update",
  url: "/api/internal/internal/update",
  async handler(arg: {
    id: string;
    name?: string;
    is_sales_and_marketing?: boolean;
    is_support?: boolean;
    is_management?: boolean;
    is_it?: boolean;
    id_account?: string;
    id_user?: string;
  }) {
    const {
      id,
      name,
      is_sales_and_marketing,
      is_support,
      is_management,
      is_it,
      id_account,
      id_user,
    } = arg;

    if (!id?.trim()) throw new Error("ID internal wajib diisi");

    // Check if internal exists
    const existing = await db.internal.findUnique({ where: { id } });

    if (!existing) throw new Error("Internal tidak ditemukan");

    // If name is being updated, check for duplicates
    if (name && name.trim() !== existing.name) {
      const nameExists = await db.internal.findFirst({
        where: { name: name.trim(), id: { not: id } },
      });

      if (nameExists)
        throw new Error("Internal dengan nama tersebut sudah ada");
    }

    // Build update data object
    const updateData: any = {};

    if (name !== undefined) updateData.name = name.trim();
    if (is_sales_and_marketing !== undefined)
      updateData.is_sales_and_marketing = is_sales_and_marketing;
    if (is_support !== undefined) updateData.is_support = is_support;
    if (is_management !== undefined) updateData.is_management = is_management;
    if (is_it !== undefined) updateData.is_it = is_it;
    if (id_account !== undefined) updateData.id_account = id_account || null;
    if (id_user !== undefined) updateData.id_user = id_user || null;

    const result = await db.internal.update({
      where: { id },
      data: updateData,
      include: { auth_user: true, auth_account: true, book_approval: true },
    });

    return result;
  },
});
