import type { ApiResponse } from "backend/lib/utils";
import type { ConfigItem } from "../../lib/types";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "cfg_list",
  url: "/api/internal/cfg/list",
  async handler(arg: {
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<ConfigItem[]>> {
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
      success: true,
      data,
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
});
