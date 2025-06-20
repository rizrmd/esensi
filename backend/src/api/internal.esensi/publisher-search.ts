import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "publisher_search",
  url: "/api/internal/publisher/search",
  async handler(arg: {
    query?: string;
    has_authors?: boolean;
    has_promo_codes?: boolean;
    has_transactions?: boolean;
    has_withdrawals?: boolean;
    has_ai_credit?: boolean;
    has_user?: boolean;
    has_account?: boolean;
    limit?: number;
    offset?: number;
    sort_by?: "name" | "website";
    sort_order?: "asc" | "desc";
  }) {
    const {
      query,
      has_authors,
      has_promo_codes,
      has_transactions,
      has_withdrawals,
      has_ai_credit,
      has_user,
      has_account,
      limit = 50,
      offset = 0,
      sort_by = "name",
      sort_order = "asc",
    } = arg;

    // Build where conditions
    const where: any = {};

    // Text search
    if (query?.trim()) {
      where.OR = [
        { name: { contains: query.trim(), mode: "insensitive" } },
        { description: { contains: query.trim(), mode: "insensitive" } },
        { website: { contains: query.trim(), mode: "insensitive" } },
        { address: { contains: query.trim(), mode: "insensitive" } },
      ];
    }

    // Relationship filters
    if (has_authors === true) where.publisher_author = { some: {} };
    else if (has_authors === false) where.publisher_author = { none: {} };

    if (has_promo_codes === true) where.promo_code = { some: {} };
    else if (has_promo_codes === false) where.promo_code = { none: {} };

    if (has_transactions === true) where.transaction = { some: {} };
    else if (has_transactions === false) where.transaction = { none: {} };

    if (has_withdrawals === true) where.withdrawal = { some: {} };
    else if (has_withdrawals === false) where.withdrawal = { none: {} };

    if (has_ai_credit === true) where.t_ai_credit = { some: {} };
    else if (has_ai_credit === false) where.t_ai_credit = { none: {} };

    if (has_user === true) where.auth_user = { some: {} };
    else if (has_user === false) where.auth_user = { none: {} };

    if (has_account !== undefined) {
      if (has_account) where.id_account = { not: null };
      else where.id_account = null;
    }

    // Build sort order
    const orderBy: any = {};
    orderBy[sort_by] = sort_order;

    // Include relations for aggregations
    const include = {
      _count: {
        select: {
          publisher_author: true,
          promo_code: true,
          transaction: true,
          withdrawal: true,
          t_ai_credit: true,
          auth_user: true,
        },
      },
    };

    const [data, total] = await Promise.all([
      db.publisher.findMany({
        where,
        include,
        take: limit,
        skip: offset,
        orderBy,
      }),
      db.publisher.count({ where }),
    ]);

    return {
      data,
      total,
      limit,
      offset,
      query,
      filters: {
        has_authors,
        has_promo_codes,
        has_transactions,
        has_withdrawals,
        has_ai_credit,
        has_user,
        has_account,
      },
      sort: { sort_by, sort_order },
    };
  },
});
