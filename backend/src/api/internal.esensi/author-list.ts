import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "author_list",
  url: "/api/internal/author/list",
  async handler(arg: { search?: string; limit?: number; offset?: number }) {
    const { search, limit = 50, offset = 0 } = arg;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { biography: { contains: search, mode: "insensitive" as const } },
            {
              social_media: { contains: search, mode: "insensitive" as const },
            },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      db.author.findMany({
        where,
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
        take: limit,
        skip: offset,
        orderBy: { name: "asc" },
      }),
      db.author.count({ where }),
    ]);

    return {
      data,
      total,
      limit,
      offset,
    };
  },
});
