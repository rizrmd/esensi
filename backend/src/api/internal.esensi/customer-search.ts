import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "customer_search",
  url: "/api/internal/customer/search",
  async handler(arg: {
    query?: string;
    has_sales?: boolean;
    has_track?: boolean;
    has_reader?: boolean;
    has_user?: boolean;
    has_account?: boolean;
    limit?: number;
    offset?: number;
    sort_by?: "name" | "email" | "whatsapp";
    sort_order?: "asc" | "desc";
  }) {
    const {
      query,
      has_sales,
      has_track,
      has_reader,
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
        { email: { contains: query.trim(), mode: "insensitive" } },
        { whatsapp: { contains: query.trim(), mode: "insensitive" } },
      ];
    }

    // Relationship filters
    if (has_sales === true) where.t_sales = { some: {} };
    else if (has_sales === false) where.t_sales = { none: {} };

    if (has_track === true) where.customer_track = { some: {} };
    else if (has_track === false) where.customer_track = { none: {} };

    if (has_reader === true) where.customer_reader = { some: {} };
    else if (has_reader === false) where.customer_reader = { none: {} };

    if (has_user === true) where.auth_user = { some: {} };
    else if (has_user === false) where.auth_user = { none: {} };

    if (has_account !== undefined) {
      if (has_account) where.id_account = { not: null };
      else where.id_account = null;
    }

    // Exclude soft deleted records
    where.deleted_at = null;

    // Build sort order
    const orderBy: any = {};
    if (sort_by === "name") orderBy.name = sort_order;
    else if (sort_by === "email") orderBy.email = sort_order;
    else if (sort_by === "whatsapp") orderBy.whatsapp = sort_order;

    // Include relations for aggregations
    const include = {
      _count: {
        select: {
          t_sales: true,
          customer_track: true,
          customer_reader: true,
          auth_user: true,
        },
      },
    };

    const [data, total] = await Promise.all([
      db.customer.findMany({
        where,
        include,
        take: limit,
        skip: offset,
        orderBy,
      }),
      db.customer.count({ where }),
    ]);

    return {
      data,
      total,
      limit,
      offset,
      query,
      filters: {
        has_sales,
        has_track,
        has_reader,
        has_user,
        has_account,
      },
      sort: { sort_by, sort_order },
    };
  },
});
