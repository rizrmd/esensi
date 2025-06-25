import { defineAPI } from "rlib/server";
import type { ApiResponse } from "backend/lib/utils";
import type { PublisherListItem } from "../../lib/types";

export default defineAPI({
  name: "publisher_list",
  url: "/api/internal/publisher/list",
  async handler(arg: {
    search?: string;
    limit?: number;
    offset?: number;
    include_user?: boolean;
    include_account?: boolean;
    include_authors?: boolean;
    include_promo_codes?: boolean;
    include_transactions?: boolean;
    include_withdrawals?: boolean;
    include_ai_credit?: boolean;
  }): Promise<ApiResponse<PublisherListItem[]>> {
    const {
      search,
      limit = 50,
      offset = 0,
      include_user = false,
      include_account = false,
      include_authors = false,
      include_promo_codes = false,
      include_transactions = false,
      include_withdrawals = false,
      include_ai_credit = false,
    } = arg;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
            { website: { contains: search, mode: "insensitive" as const } },
            { address: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const include = {
      ...(include_user && { auth_user: true }),
      ...(include_account && { auth_account: true }),
      ...(include_authors && {
        publisher_author: { include: { author: true } },
      }),
      ...(include_promo_codes && { promo_code: true }),
      ...(include_transactions && { transaction: true }),
      ...(include_withdrawals && { withdrawal: true }),
      ...(include_ai_credit && { t_ai_credit: true }),
    };

    const [data, total] = await Promise.all([
      db.publisher.findMany({
        where,
        include,
        take: limit,
        skip: offset,
        orderBy: { name: "asc" },
      }),
      db.publisher.count({ where }),
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
