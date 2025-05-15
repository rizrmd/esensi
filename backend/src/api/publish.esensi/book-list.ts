import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { book } from "shared/models";

export default defineAPI({
  name: "book_list",
  url: "/api/book/list",
  async handler(arg: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<ApiResponse<book[]>> {
    try {
      const page = arg.page || 1;
      const limit = arg.limit || 10;
      const skip = (page - 1) * limit;
      const where: any = { deleted_at: null };

      if (arg.search) {
        where.OR = [
          { name: { contains: arg.search, mode: "insensitive" } },
          { slug: { contains: arg.search, mode: "insensitive" } },
          { desc: { contains: arg.search, mode: "insensitive" } },
        ];
      }

      if (arg.status) {
        where.status = arg.status;
      }

      const total = await db.book.count({ where });
      const books: book[] = await db.book.findMany({
        where,
        orderBy: {
          published_date: "desc",
        },
        skip,
        take: limit,
      });

      return {
        success: true,
        data: books,
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
