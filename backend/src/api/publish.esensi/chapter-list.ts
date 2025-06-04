import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { chapter } from "shared/models";

export default defineAPI({
  name: "chapter_list",
  url: "/api/publish/chapter/list",
  async handler(arg: {
    page?: number;
    limit?: number;
    id_book?: string;
    id_product?: string;
    search?: string;
  }): Promise<ApiResponse<chapter[]>> {
    try {
      const page = arg.page || 1;
      const limit = arg.limit || 10;
      const skip = (page - 1) * limit;
      const where: any = {};

      if (arg.id_book) {
        where.id_book = arg.id_book;
      }

      if (arg.id_product) {
        where.id_product = arg.id_product;
      }

      if (arg.search) {
        where.OR = [
          { name: { contains: arg.search, mode: "insensitive" } },
          { slug: { contains: arg.search, mode: "insensitive" } },
          { desc: { contains: arg.search, mode: "insensitive" } },
        ];
      }

      const total = await db.chapter.count({ where });
      const chapter = await db.chapter.findMany({
        where,
        orderBy: {
          number: "asc",
        },
        skip,
        take: limit,
      });

      return {
        success: true,
        data: chapter,
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
