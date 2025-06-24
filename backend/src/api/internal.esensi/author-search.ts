import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "author_search",
  url: "/api/internal/author/search",
  async handler(arg: {
    query?: string;
    has_books?: boolean;
    has_products?: boolean;
    has_publishers?: boolean;
    has_user?: boolean;
    has_account?: boolean;
    limit?: number;
    offset?: number;
    sort_by?: "name" | "created_at" | "book_count" | "product_count";
    sort_order?: "asc" | "desc";
  }) {
    const {
      query,
      has_books,
      has_products,
      has_publishers,
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
        { biography: { contains: query.trim(), mode: "insensitive" } },
        { social_media: { contains: query.trim(), mode: "insensitive" } },
      ];
    }

    // Filter by content existence
    if (has_books === true) where.book = { some: {} };
    else if (has_books === false) where.book = { none: {} };

    if (has_products === true) where.product = { some: {} };
    else if (has_products === false) where.product = { none: {} };

    if (has_publishers === true) where.publisher_author = { some: {} };
    else if (has_publishers === false) where.publisher_author = { none: {} };

    if (has_user === true) where.id_user = { not: null };
    else if (has_user === false) where.id_user = null;

    if (has_account === true) where.id_account = { not: null };
    else if (has_account === false) where.id_account = null;

    // Build orderBy
    let orderBy: any = {};

    switch (sort_by) {
      case "name":
        orderBy = { name: sort_order };
        break;
      case "created_at":
        // Note: author table doesn't have created_at, so we'll use name as fallback
        orderBy = { name: sort_order };
        break;
      case "book_count":
        orderBy = { book: { _count: sort_order } };
        break;
      case "product_count":
        orderBy = { product: { _count: sort_order } };
        break;
      default:
        orderBy = { name: sort_order };
    }

    const [data, total] = await Promise.all([
      db.author.findMany({
        where,
        include: {
          auth_user: true,
          auth_account: true,
          _count: {
            select: {
              book: true,
              product: true,
              publisher_author: true,
            },
          },
        },
        orderBy,
        take: limit,
        skip: offset,
      }),
      db.author.count({ where }),
    ]);

    return {
      data: data.map((author) => ({
        ...author,
        book_count: author._count.book,
        product_count: author._count.product,
        publisher_count: author._count.publisher_author,
      })),
      total,
      limit,
      offset,
      filters: {
        query,
        has_books,
        has_products,
        has_publishers,
        has_user,
        has_account,
      },
    };
  },
});
