import { defineAPI } from "rlib/server";
import type { JsonValue } from "shared/models/runtime/library";

export default defineAPI({
  name: "author_bulk_update",
  url: "/api/internal/author/bulk-update",
  async handler(arg: {
    authors: Array<{
      id: string;
      name?: string;
      biography?: string;
      social_media?: string;
      avatar?: string;
      id_account?: string;
      id_user?: string;
      cfg?: Record<string, any>;
    }>;
  }): Promise<{
    success_count: number;
    error_count: number;
    results: {
      id: string;
      success: boolean;
      data: {
        id: string;
        name: string;
        biography: string | null;
        social_media: string | null;
        avatar: string | null;
        id_account: string | null;
        id_user: string | null;
        cfg: JsonValue | null;
        bank_account_number: string | null;
        bank_account_provider: string | null;
      };
    }[];
    errors: {
      id: string;
      success: boolean;
      error: string;
    }[];
  }> {
    const { authors } = arg;

    if (!authors || !Array.isArray(authors) || authors.length === 0)
      throw new Error("Data author tidak valid");

    const results = [];
    const errors = [];

    for (const authorData of authors) {
      try {
        const { id, ...updateData } = authorData;

        if (!id?.trim()) throw new Error("ID author wajib diisi");

        // Check if author exists
        const existing = await db.author.findUnique({ where: { id } });

        if (!existing)
          throw new Error(`Author dengan ID ${id} tidak ditemukan`);

        // If name is being updated, check for duplicates
        if (updateData.name && updateData.name.trim() !== existing.name) {
          const nameExists = await db.author.findFirst({
            where: {
              name: updateData.name.trim(),
              id: { not: id },
            },
          });

          if (nameExists)
            throw new Error(
              `Author dengan nama "${updateData.name}" sudah ada`
            );
        }

        // Build update data object
        const cleanUpdateData: any = {};

        if (updateData.name !== undefined)
          cleanUpdateData.name = updateData.name.trim();
        if (updateData.biography !== undefined)
          cleanUpdateData.biography = updateData.biography?.trim() || null;
        if (updateData.social_media !== undefined)
          cleanUpdateData.social_media =
            updateData.social_media?.trim() || null;
        if (updateData.avatar !== undefined)
          cleanUpdateData.avatar = updateData.avatar?.trim() || null;
        if (updateData.id_account !== undefined)
          cleanUpdateData.id_account = updateData.id_account || null;
        if (updateData.id_user !== undefined)
          cleanUpdateData.id_user = updateData.id_user || null;
        if (updateData.cfg !== undefined)
          cleanUpdateData.cfg = updateData.cfg || undefined;

        const result = await db.author.update({
          where: { id },
          data: cleanUpdateData,
        });

        results.push({ id, success: true, data: result });
      } catch (error) {
        errors.push({
          id: authorData.id,
          success: false,
          error: error instanceof Error ? error.message : "Terjadi kesalahan",
        });
      }
    }

    return {
      success_count: results.length,
      error_count: errors.length,
      results,
      errors,
    };
  },
});
