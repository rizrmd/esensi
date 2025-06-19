import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "cfg_list",
  url: "/api/internal/cfg/list",
  async handler(arg: { search?: string; limit?: number; offset?: number }) {
    const { search, limit = 50, offset = 0 } = arg;

    const where = search
      ? {
          OR: [
            { key: { contains: search, mode: "insensitive" as const } },
            { value: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      db.cfg.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { key: "asc" },
      }),
      db.cfg.count({ where }),
    ]);

    return {
      data,
      total,
      limit,
      offset,
    };
  },
});
