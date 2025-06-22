import type { Author } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
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
  }): Promise<ApiResponse<Author>> {
    const { name, biography, social_media, avatar, id_account, id_user, cfg } =
      arg;

    // Validate required fields
    if (!name?.trim()) {
      throw new Error("Nama penulis wajib diisi");
    }

    // Check if author with same name already exists
    const existing = await db.author.findFirst({
      where: { name: name.trim() },
    });

    if (existing) throw new Error("Penulis dengan nama tersebut sudah ada");

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
      message: "Penulis berhasil ditambahkan",
    };
  },
});
