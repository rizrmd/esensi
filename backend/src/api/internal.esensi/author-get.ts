import type { Author } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "author_get",
  url: "/api/internal/author/get",
  async handler(arg: { id: string }): Promise<ApiResponse<Author>> {
    const { id } = arg;
    if (!id?.trim()) throw new Error("ID penulis wajib diisi");

    const author = await db.author.findUnique({
      where: { id },
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

    if (!author) throw new Error("Penulis tidak ditemukan");
    return { success: true, data: author };
  },
});
