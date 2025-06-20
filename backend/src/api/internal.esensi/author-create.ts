import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "author_create",
  url: "/api/internal/author/create",
  async handler(arg: {
    name: string;
    biography?: string;
    social_media?: string;
    avatar?: string;
    id_account?: string;
    id_user?: string;
    cfg?: Record<string, any>;
  }) {
    const { name, biography, social_media, avatar, id_account, id_user, cfg } =
      arg;

    // Validate required fields
    if (!name?.trim()) {
      throw new Error("Nama author wajib diisi");
    }

    // Check if author with same name already exists
    const existing = await db.author.findFirst({
      where: { name: name.trim() },
    });

    if (existing) {
      throw new Error("Author dengan nama tersebut sudah ada");
    }

    const result = await db.author.create({
      data: {
        name: name.trim(),
        biography: biography?.trim() || null,
        social_media: social_media?.trim() || null,
        avatar: avatar?.trim() || null,
        id_account: id_account || null,
        id_user: id_user || null,
        cfg: cfg || undefined,
      },
      include: {
        auth_user: true,
        auth_account: true,
      },
    });

    return result;
  },
});
