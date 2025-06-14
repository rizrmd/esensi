import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { PublisherAuthor } from "../../lib/types";

export default defineAPI({
  name: "publisher_author_create",
  url: "/api/publish/publisher-author/create",
  async handler(arg: {
    id_publisher?: string;
    id_author?: string;
  }): Promise<ApiResponse<PublisherAuthor>> {
    try {
      if (!arg.id_publisher) {
        return {
          success: false,
          message: "Parameter id_publisher harus diisi",
        };
      }

      if (!arg.id_author) {
        return {
          success: false,
          message: "Parameter id_author harus diisi",
        };
      }

      const existingRelation = await db.publisher_author.findFirst({
        where: {
          publisher_id: arg.id_publisher,
          author_id: arg.id_author,
        },
      });

      if (existingRelation) {
        return {
          success: false,
          message: "Penulis sudah tergabung dengan penerbit ini",
        };
      }

      const created = await db.publisher_author.create({
        data: {
          publisher_id: arg.id_publisher,
          author_id: arg.id_author,
        },
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

      return { success: true, message: "Penulis berhasil ditambahkan", data: created };
    } catch (error) {
      console.error("Error managing publisher authors:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengelola ikatan penulis-penerbit",
      };
    }
  },
});
