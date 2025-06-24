import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "internal_search",
  url: "/api/internal/internal/search",
  async handler(arg: {
    query?: string;
    has_sales_and_marketing?: boolean;
    has_support?: boolean;
    has_management?: boolean;
    has_it?: boolean;
    has_user?: boolean;
    has_account?: boolean;
    has_book_approvals?: boolean;
    limit?: number;
    offset?: number;
    sort_by?: "name";
    sort_order?: "asc" | "desc";
  }): Promise<ApiResponse<any[]>> {
    const {
      query,
      has_sales_and_marketing,
      has_support,
      has_management,
      has_it,
      has_user,
      has_account,
      has_book_approvals,
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

    // Role filters
    if (has_sales_and_marketing !== undefined)
      where.is_sales_and_marketing = has_sales_and_marketing;
    if (has_support !== undefined) where.is_support = has_support;
    if (has_management !== undefined) where.is_management = has_management;
    if (has_it !== undefined) where.is_it = has_it;

    // Relationship filters
    if (has_user === true) where.auth_user = { some: {} };
    else if (has_user === false) where.auth_user = { none: {} };

    if (has_account !== undefined) {
      if (has_account) where.id_account = { not: null };
      else where.id_account = null;
    }

    if (has_book_approvals === true) where.book_approval = { some: {} };
    else if (has_book_approvals === false) where.book_approval = { none: {} };

    // Build sort order
    const orderBy: any = {};
    orderBy[sort_by] = sort_order;

    // Include relations for aggregations
    const include = {
      _count: {
        select: { auth_user: true, book_approval: true },
      },
    };

    const [data, total] = await Promise.all([
      db.internal.findMany({
        where,
        include,
        take: limit,
        skip: offset,
        orderBy,
      }),
      db.internal.count({ where }),
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
