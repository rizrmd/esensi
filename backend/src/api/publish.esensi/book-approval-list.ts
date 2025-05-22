import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { BookApproval } from "../types";

export default defineAPI({
  name: "book_approval_list",
  url: "/api/publish/book-approval/list",
  async handler(arg: {
    id_book: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<BookApproval[]>> {
    try {
      const book = await db.book.findUnique({
        where: { id: arg.id_book },
      });

      if (!book) {
        return { success: false, message: "Buku tidak ditemukan" };
      }

      const page = arg.page || 1;
      const limit = arg.limit || 10;
      const skip = (page - 1) * limit;

      const total = await db.book_approval.count({
        where: {
          id_book: arg.id_book,
        },
      });

      const approval = await db.book_approval.findMany({
        where: {
          id_book: arg.id_book,
        },
        orderBy: {
          created_at: "asc",
        },
        skip,
        take: limit,
        include: {
          book: {
            include: {
              author: true,
            },
          },
          internal: true,
        },
      });

      return {
        success: true,
        data: approval,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error in book approval list API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengambil riwayat buku",
      };
    }
  },
});
