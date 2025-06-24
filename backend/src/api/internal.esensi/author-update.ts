import type { Author } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "author_update",
  url: "/api/internal/author/update",
  async handler(arg: {
    id: string;
    name?: string;
    biography?: string;
    social_media?: string;
    avatar?: string;
    id_account?: string;
    id_user?: string;
    cfg?: Record<string, any>;
    bank_account_number?: string;
    bank_account_provider?: string;
  }): Promise<ApiResponse<Author>> {
    const {
      id,
      name,
      biography,
      social_media,
      avatar,
      id_account,
      id_user,
      cfg,
      bank_account_number,
      bank_account_provider,
    } = arg;

    if (!id?.trim()) throw new Error("ID author wajib diisi");

    // Check if author exists
    const existing = await db.author.findUnique({
      where: { id },
    });

    if (!existing) throw new Error("Author tidak ditemukan");

    // If name is being updated, check for duplicates
    if (name && name.trim() !== existing.name) {
      const nameExists = await db.author.findFirst({
        where: {
          name: name.trim(),
          id: { not: id },
        },
      });

      if (nameExists) throw new Error("Author dengan nama tersebut sudah ada");
    }

    // Build update data object
    const updateData: any = {};

    if (name !== undefined) updateData.name = name.trim();
    if (biography !== undefined)
      updateData.biography = biography?.trim() || null;
    if (social_media !== undefined)
      updateData.social_media = social_media?.trim() || null;
    if (avatar !== undefined) updateData.avatar = avatar?.trim() || null;
    if (id_account !== undefined) updateData.id_account = id_account || null;
    if (id_user !== undefined) updateData.id_user = id_user || null;
    if (cfg !== undefined) updateData.cfg = cfg || undefined;
    if (bank_account_number !== undefined)
      updateData.bank_account_number = bank_account_number?.trim() || null;
    if (bank_account_provider !== undefined)
      updateData.bank_account_provider = bank_account_provider?.trim() || null;

    const result = await db.author.update({
      where: { id },
      data: updateData,
      include: {
        auth_account: true,
        auth_user: { orderBy: { created_at: "desc" }, take: 10 },
        publisher_author: {
          include: {
            publisher: {
              include: {
                transaction: { orderBy: { created_at: "desc" }, take: 10 },
                promo_code: { orderBy: { valid_to: "desc" }, take: 10 },
              },
            },
          },
        },
        book: { orderBy: { published_date: "desc" }, take: 10 },
        product: { orderBy: { published_date: "desc" }, take: 10 },
        bundle: { orderBy: { created_at: "desc" }, take: 10 },
      },
    });

    return {
      success: true,
      data: result,
      message: "Buku berhasil ditambahkan",
    };
  },
});
