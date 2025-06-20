import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "author_list",
  url: "/api/internal/author/list",
  async handler(arg: {
    search?: string;
    limit?: number;
    offset?: number;
    include_user?: boolean;
    include_account?: boolean;
  }) {
    const {
      search,
      limit = 50,
      offset = 0,
      include_user = false,
      include_account = false,
    } = arg;

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

    const include = {
      ...(include_user && { auth_user: true }),
      ...(include_account && { auth_account: true }),
    };

    const [data, total] = await Promise.all([
      db.author.findMany({
        where,
        include,
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
