import type { User } from "backend/lib/better-auth";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "publisher_authors",
  url: "/api/publisher/authors",
  async handler(arg: {
    user: Partial<User>;
    action: "list" | "add" | "remove";
    author_id?: string;
  }) {
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

      const publisherId = authUser.id_publisher;

      // Handle different actions
      if (arg.action === "list") {
        // List all authors associated with this publisher
        const authors = await db.publisher_author.findMany({
          where: { publisher_id: publisherId },
          include: {
            author: {
              include: {
                auth_user: {
                  select: {
                    name: true,
                    email: true,
                    image: true,
                  },
                },
                product: {
                  where: { deleted_at: null },
                  select: { id: true },
                },
              },
            },
          },
        });

        return {
          success: true,
          data: authors.map((pa) => ({
            ...pa.author,
            productCount: pa.author.product.length,
          })),
        };
      } else if (arg.action === "add" && arg.author_id) {
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
            publisher_id: publisherId,
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
            publisher_id: publisherId,
            author_id: arg.author_id,
          },
        });

        return { success: true, message: "Penulis berhasil ditambahkan" };
      } else if (arg.action === "remove" && arg.author_id) {
        // Delete the relationship
        await db.publisher_author.deleteMany({
          where: {
            publisher_id: publisherId,
            author_id: arg.author_id,
          },
        });

        return {
          success: true,
          message: "Penulis berhasil dihapus dari penerbit",
        };
      } else {
        return { success: false, message: "Parameter tidak valid" };
      }
    } catch (error) {
      console.error("Error managing publisher authors:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengelola penulis",
      };
    }
  },
});
