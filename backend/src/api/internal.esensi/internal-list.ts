import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "internal_list",
  url: "/api/internal/internal/list",
  async handler(arg: {
    search?: string;
    limit?: number;
    offset?: number;
    include_user?: boolean;
    include_account?: boolean;
    include_book_approvals?: boolean;
    filter_sales_and_marketing?: boolean;
    filter_support?: boolean;
    filter_management?: boolean;
    filter_it?: boolean;
  }) {
    const {
      search,
      limit = 50,
      offset = 0,
      include_user = false,
      include_account = false,
      include_book_approvals = false,
      filter_sales_and_marketing,
      filter_support,
      filter_management,
      filter_it,
    } = arg;

    const where: any = {};

    // Text search
    if (search?.trim())
      where.name = { contains: search.trim(), mode: "insensitive" as const };

    // Role filters
    if (filter_sales_and_marketing !== undefined)
      where.is_sales_and_marketing = filter_sales_and_marketing;
    if (filter_support !== undefined) where.is_support = filter_support;
    if (filter_management !== undefined)
      where.is_management = filter_management;
    if (filter_it !== undefined) where.is_it = filter_it;

    const include = {
      ...(include_user && { auth_user: true }),
      ...(include_account && { auth_account: true }),
      ...(include_book_approvals && { book_approval: true }),
    };

    const [data, total] = await Promise.all([
      db.internal.findMany({
        where,
        include,
        take: limit,
        skip: offset,
        orderBy: { name: "asc" },
      }),
      db.internal.count({ where }),
    ]);

    return { data, total, limit, offset };
  },
});
