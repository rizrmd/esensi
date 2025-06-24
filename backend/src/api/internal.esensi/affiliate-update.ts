import type { Affiliate } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "affiliate_update",
  url: "/api/internal/affiliate/update",
  async handler(arg: {
    id: string;
    name?: string;
    id_account?: string;
    id_user?: string;
  }): Promise<ApiResponse<Affiliate>> {
    const { id, name, id_account, id_user } = arg;

    if (!id?.trim()) throw new Error("ID affiliate wajib diisi");

    // Check if affiliate exists
    const existing = await db.affiliate.findUnique({ where: { id } });

    if (!existing) throw new Error("Affiliate tidak ditemukan");

    // If name is being updated, check for duplicates
    if (name && name.trim() !== existing.name) {
      const nameExists = await db.affiliate.findFirst({
        where: {
          name: name.trim(),
          id: { not: id },
        },
      });

      if (nameExists)
        throw new Error("Affiliate dengan nama tersebut sudah ada");
    }

    // Build update data object
    const updateData: any = {};

    if (name !== undefined) updateData.name = name.trim();
    if (id_account !== undefined) updateData.id_account = id_account || null;
    if (id_user !== undefined) updateData.id_user = id_user || null;

    const result = await db.affiliate.update({
      where: { id },
      data: updateData,
      include: { auth_user: true, auth_account: true },
    });

    return {
      success: true,
      data: result,
      message: "Buku berhasil ditambahkan",
    };
  },
});
