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
  }) {
    const {
      id,
      name,
      biography,
      social_media,
      avatar,
      id_account,
      id_user,
      cfg,
    } = arg;

    if (!id?.trim()) {
      throw new Error("ID author wajib diisi");
    }

    // Check if author exists
    const existing = await db.author.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Author tidak ditemukan");
    }

    // If name is being updated, check for duplicates
    if (name && name.trim() !== existing.name) {
      const nameExists = await db.author.findFirst({
        where: {
          name: name.trim(),
          id: { not: id },
        },
      });

      if (nameExists) {
        throw new Error("Author dengan nama tersebut sudah ada");
      }
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

    const result = await db.author.update({
      where: { id },
      data: updateData,
      include: {
        auth_user: true,
        auth_account: true,
      },
    });

    return result;
  },
});
