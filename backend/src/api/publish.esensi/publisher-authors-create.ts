import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type {
  auth_account,
  auth_user,
  author,
  book,
  product,
  publisher_author,
} from "shared/models";

export type PublisherAuthorCreateAPIResponse = ApiResponse<
  (publisher_author & {
    author: author & {
      auth_account: auth_account | null;
      auth_user: auth_user[];
      book: book[];
      product: product[];
    };
  })[]
>;

export default defineAPI({
  name: "publisher_author_create",
  url: "/api/publisher-author/create",
  async handler(arg: {
    user: Partial<User>;
    author_id: string;
  }): Promise<PublisherAuthorCreateAPIResponse> {
    try {
      // Get publisher ID from auth user
      const authUser = await db.auth_user.findUnique({
        where: { id: arg.user.id },
        select: { id_publisher: true },
      });

      if (!authUser?.id_publisher) {
        return {
          success: false,
          message: "Hanya penerbit yang dapat mengakses API ini",
        };
      }

      // Check if author exists
      const author = await db.author.findUnique({
        where: { id: arg.author_id },
      });

      if (!author) {
        return { success: false, message: "Penulis tidak ditemukan" };
      }

      // Check if relationship already exists
      const existingRelation = await db.publisher_author.findFirst({
        where: {
          publisher_id: authUser.id_publisher,
          author_id: arg.author_id,
        },
      });

      if (existingRelation) {
        return {
          success: false,
          message: "Penulis sudah tergabung dengan penerbit ini",
        };
      }

      // Create new relationship
      await db.publisher_author.create({
        data: {
          publisher_id: authUser.id_publisher,
          author_id: arg.author_id,
        },
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
      });

      return { success: true, message: "Penulis berhasil ditambahkan" };
    } catch (error) {
      console.error("Error managing publisher authors:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengelola ikatan penulis-penerbit",
      };
    }
  },
});
