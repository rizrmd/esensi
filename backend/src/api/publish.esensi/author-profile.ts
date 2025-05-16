import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type {
  auth_account,
  auth_user,
  author,
  book,
  product,
  publisher,
} from "shared/models";

export type AuthorProfileAPIResponse = ApiResponse<
  | (author & {
      auth_account: auth_account | null;
      auth_user: auth_user[];
      book: book[];
      publisher_author: { publisher: publisher }[];
      product: product[];
    })
  | null
>;

export default defineAPI({
  name: "author_profile",
  url: "/api/author/profile",
  async handler(arg: {
    user: Partial<User>;
  }): Promise<AuthorProfileAPIResponse> {
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
          auth_account: true,
          auth_user: true,
          book: true,
          publisher_author: {
            select: {
              publisher: true,
            },
          },
          product: {
            orderBy: {
              published_date: "desc",
            },
          },
        },
      });

      return { success: true, data: author };
    } catch (error) {
      console.error("Error fetching author profile:", error);
      return { success: false, message: "Gagal mengambil profil penulis" };
    }
  },
});
