import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { Author } from "../../lib/types";

export default defineAPI({
  name: "author_detail",
  url: "/api/publish/author/detail",
  async handler(arg: { id: string }): Promise<ApiResponse<Author>> {
    try {
      const author = await db.author.findUnique({
        where: {
          id: arg.id,
        },
        include: {
          auth_account: true,
          auth_user: {
            orderBy: {
              created_at: "desc",
            },
            take: 10,
          },
          publisher_author: {
            include: {
              publisher: {
                include: {
                  transaction: {
                    orderBy: {
                      created_at: "desc",
                    },
                    take: 10,
                  },
                  promo_code: {
                    orderBy: {
                      valid_to: "desc",
                    },
                    take: 10,
                  },
                },
              },
            },
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
      });

      if (!author) {
        return {
          success: false,
          message: "Penulis tidak ditemukan",
        };
      }

      return { success: true, data: author };
    } catch (error) {
      console.error("Error in author detail API:", error);
      return { success: false, message: "Gagal mengambil detil penulis" };
    }
  },
});
