import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type {
  auth_account,
  auth_user,
  author,
  book,
  product,
  promo_code,
  publisher,
  publisher_author,
  transaction,
} from "shared/models";

export default defineAPI({
  name: "author_detail",
  url: "/api/author/detail",
  async handler(arg: { user: Partial<User> }): Promise<
    ApiResponse<
      | (author & {
          auth_user: auth_user[];
          auth_account: auth_account | null;
          publisher_author: (publisher_author & {
            publisher: publisher & {
              transaction: transaction[];
              promo_code: promo_code[];
            };
          })[];
          book: book[];
          product: product[];
        })
      | null
    >
  > {
    try {
      const author = await db.author.findFirst({
        where: {
          auth_user: {
            some: {
              id: arg.user.id,
            },
          },
        },
        include: {
          auth_user: true,
          auth_account: true,
          publisher_author: {
            include: {
              publisher: {
                include: {
                  transaction: true,
                  promo_code: true,
                },
              },
            },
          },
          book: true,
          product: true,
        },
      });

      return { success: true, data: author };
    } catch (error) {
      console.error("Error fetching publisher profile:", error);
      return { success: false, message: "Gagal mengambil profil penerbit" };
    }
  },
});
