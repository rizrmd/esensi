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

export type PublisherDetailAPIResponse = ApiResponse<
  | (publisher & {
      auth_user: auth_user[];
      auth_account: auth_account | null;
      publisher_author: (publisher_author & {
        author: author & {
          auth_account: auth_account | null;
          auth_user: auth_user[];
          book: book[];
          product: product[];
        };
      })[];
      transaction: transaction[];
      promo_code: promo_code[];
    })
  | null
>;

export default defineAPI({
  name: "publisher_detail",
  url: "/api/publisher/detail",
  async handler(arg: {
    user: Partial<User>;
  }): Promise<PublisherDetailAPIResponse> {
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
          auth_user: true,
          auth_account: true,
          publisher_author: {
            include: {
              author: {
                include: {
                  auth_account: true,
                  auth_user: true,
                  book: true,
                  product: true,
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
          },
        },
      });

      return { success: true, data: publisher };
    } catch (error) {
      console.error("Error fetching publisher profile:", error);
      return { success: false, message: "Gagal mengambil profil penerbit" };
    }
  },
});
