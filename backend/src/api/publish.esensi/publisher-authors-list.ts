import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { PublisherAuthor, Role } from "../types";

export default defineAPI({
  name: "publisher_author_list",
  url: "/api/publish/publisher-author/list",
  async handler(arg: {
    field: Role.AUTHOR | Role.PUBLISHER;
    id: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PublisherAuthor[]>> {
    try {
      const page = arg.page || 1;
      const limit = arg.limit || 10;
      const skip = (page - 1) * limit;
      const where = { [`${arg.field}_id`]: arg.id };

      const total = await db.publisher_author.count({ where });
      const pa = await db.publisher_author.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: {
            include: {
              auth_account: true,
              auth_user: {
                orderBy: {
                  created_at: "desc",
                },
                take: 10,
              },
              book: {
                orderBy: {
                  published_date: "desc",
                },
                take: 10,
              },
              product: {
                orderBy: {
                  published_date: "desc",
                },
                take: 10,
              },
            },
          },
        },
      });

      return {
        success: true,
        data: pa,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error managing publisher authors:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengelola ikatan penulis-penerbit",
      };
    }
  },
});
