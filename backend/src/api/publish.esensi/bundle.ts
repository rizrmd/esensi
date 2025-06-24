import { defineAPI } from "rlib/server";
import type { ApiResponse } from "backend/lib/utils";

export default defineAPI({
  name: "bundle_list",
  url: "/api/publish/bundle",
  async handler(arg: { 
    author_id: string; 
    page?: number; 
    limit?: number; 
    search?: string;
  }): Promise<ApiResponse<any[]>> {
    const page = arg.page || 1;
    const limit = arg.limit || 10;
    const offset = (page - 1) * limit;

    const where = {
      bundle_product: {
        some: {
          product: {
            id_author: arg.author_id
          }
        }
      },
      deleted_at: null,
      ...(arg.search ? {
        OR: [
          { name: { contains: arg.search, mode: 'insensitive' as const } },
          { desc: { contains: arg.search, mode: 'insensitive' as const } }
        ]
      } : {})
    };

    const [bundles, total] = await Promise.all([
      db.bundle.findMany({
        where,
        select: {
          id: true,
          name: true,
          desc: true,
          real_price: true,
          strike_price: true,
          currency: true,
          status: true,
          cover: true,
          slug: true,
          // Note: cfg is intentionally excluded for authors
          bundle_product: {
            select: {
              product: {
                select: {
                  id: true,
                  name: true,
                  real_price: true,
                  currency: true
                }
              }
            }
          }
        },
        orderBy: { name: 'asc' },
        skip: offset,
        take: limit,
      }),
      db.bundle.count({ where })
    ]);

    return {
      success: true,
      data: bundles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },
});
