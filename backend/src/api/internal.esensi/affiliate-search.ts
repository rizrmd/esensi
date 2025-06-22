import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "affiliate_search",
  url: "/api/internal/affiliate/search",
  async handler(arg: {
    query?: string;
    has_user?: boolean;
    has_account?: boolean;
    limit?: number;
    offset?: number;
    sort_by?: "name";
    sort_order?: "asc" | "desc";
  }) {
    const {
      query,
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
    if (query?.trim())
      where.name = { contains: query.trim(), mode: "insensitive" };

    // Relationship filters
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
      _count: { select: { auth_user: true } },
    };

    const [data, total] = await Promise.all([
      db.affiliate.findMany({
        where,
        include,
        take: limit,
        skip: offset,
        orderBy,
      }),
      db.affiliate.count({ where }),
    ]);

    return {
      data,
      total,
      limit,
      offset,
      query,
      filters: { has_user, has_account },
      sort: { sort_by, sort_order },
    };
  },
});
