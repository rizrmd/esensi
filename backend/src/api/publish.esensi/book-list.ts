import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { Book } from "../../lib/types";

export default defineAPI({
  name: "book_list",
  url: "/api/publish/book/list",
  async handler(arg: {
    page?: number;
    limit?: number;
    id_author?: string;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<Book[]>> {
    try {
      const page = arg.page || 1;
      const limit = arg.limit || 10;
      const skip = (page - 1) * limit;
      const where: any = { deleted_at: null };

      if (arg.id_author) {
        where.id_author = arg.id_author;
      }

      if (arg.status) {
        where.status = arg.status;
      }

      if (arg.search) {
        where.OR = [
          { name: { contains: arg.search, mode: "insensitive" } },
          { slug: { contains: arg.search, mode: "insensitive" } },
          { desc: { contains: arg.search, mode: "insensitive" } },
        ];
      }

      const total = await db.book.count({ where });
      const book = await db.book.findMany({
        where,
        orderBy: {
          published_date: "desc",
        },
        skip,
        take: limit,
        include: {
          author: true,
          book_approval: {
            take: 10,
            orderBy: {
              created_at: "desc",
            },
          },
          book_changes_log: {
            take: 10,
            orderBy: {
              created_at: "asc",
            },
          },
          product: true,
          chapter: {
            take: 10,
          },
        },
      });

      return {
        success: true,
        data: book,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error in book list API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengambil daftar buku",
      };
    }
  },
});
