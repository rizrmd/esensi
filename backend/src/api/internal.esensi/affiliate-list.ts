import type { Affiliate } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "affiliate_list",
  url: "/api/internal/affiliate/list",
  async handler(arg: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<Affiliate[]>> {
    const page = arg.page || 1;
    const limit = arg.limit || 10;
    const skip = (page - 1) * limit;

    const where = arg.search
      ? { name: { contains: arg.search, mode: "insensitive" as const } }
      : {};

    const [data, total] = await Promise.all([
      db.affiliate.findMany({
        where,
        include: { auth_user: true, auth_account: true },
        take: limit,
        skip,
        orderBy: { name: "asc" },
      }),
      db.affiliate.count({ where }),
    ]);

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
});
