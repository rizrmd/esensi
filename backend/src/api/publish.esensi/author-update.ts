import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { author } from "shared/models";
import type { Author } from "../types";

export default defineAPI({
  name: "author_update",
  url: "/api/publish/author/update",
  async handler(arg: {
    id: string;
    data: Partial<author>;
  }): Promise<ApiResponse<Author>> {
    try {
      const author = await db.author.findUnique({ where: { id: arg.id } });
      if (!author) {
        return { success: false, message: "Penulis tidak ditemukan" };
      }

      const updated = await db.author.update({
        where: { id: arg.id },
        data: {
          name: arg.data.name,
          biography: arg.data.biography,
          social_media: arg.data.social_media,
          avatar: arg.data.avatar,
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

      if (!updated) return { success: false, message: "Penulis tidak ditemukan" };

      return {
        success: true,
        data: updated,
        message: "Penulis berhasil diperbarui",
      };
    } catch (error) {
      console.error("Error in author update API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam memperbarui penulis",
      };
    }
  },
});
