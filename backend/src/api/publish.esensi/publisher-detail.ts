import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { Publisher } from "../../lib/types";

export default defineAPI({
  name: "publisher_detail",
  url: "/api/publisher/detail",
  async handler(arg: { user: Partial<User> }): Promise<ApiResponse<Publisher>> {
    try {
      const publisher = await db.publisher.findFirst({
        where: {
          auth_user: {
            some: {
              id: arg.user.id,
            },
          },
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
              author: {
                include: {
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
          },
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
      });

      if (!publisher) {
        return {
          success: false,
          message: "Penerbit tidak ditemukan",
        };
      }

      return { success: true, data: publisher };
    } catch (error) {
      console.error("Error in publisher detail API:", error);
      return { success: false, message: "Gagal mengambil detil penerbit" };
    }
  },
});
