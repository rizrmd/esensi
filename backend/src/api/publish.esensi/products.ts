import { defineAPI } from "rlib/server";
import type { User } from "better-auth/types";

export default defineAPI({
  name: "products",
  url: "/api/products",
  async handler(arg: {
    user: User;
    action: "list" | "add" | "update" | "delete";
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    // for add/update
    data?: any;
    // for update/delete
    id?: string;
  }) {
    try {
      // Check if user is publisher or author
      const authUser = await db.auth_user.findUnique({
        where: { id: arg.user.id },
        select: {
          id_author: true,
          id_publisher: true,
        },
      });

      if (!authUser) {
        return { success: false, message: "Pengguna tidak ditemukan" };
      }

      if (arg.action === "list") {
        const page = arg.page || 1;
        const limit = arg.limit || 10;
        const skip = (page - 1) * limit;
        const where: any = { deleted_at: null };
        if (authUser.id_author) {
          where.id_author = authUser.id_author;
        } else if (authUser.id_publisher) {
          const publisherAuthors = await db.publisher_author.findMany({
            where: { publisher_id: authUser.id_publisher },
            select: { author_id: true },
          });
          if (publisherAuthors.length > 0) {
            where.id_author = {
              in: publisherAuthors.map((pa) => pa.author_id),
            };
          }
        }
        if (arg.search) {
          where.OR = [
            { name: { contains: arg.search, mode: "insensitive" } },
            { slug: { contains: arg.search, mode: "insensitive" } },
            { desc: { contains: arg.search, mode: "insensitive" } },
          ];
        }
        if (arg.status) {
          where.status = arg.status;
        }
        const total = await db.product.count({ where });
        const products = await db.product.findMany({
          where,
          include: {
            author: true,
            product_category: {
              include: {
                category: true,
              },
            },
          },
          orderBy: {
            published_date: "desc",
          },
          skip,
          take: limit,
        });
        return {
          success: true,
          data: products,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        };
      } else if (arg.action === "add" && arg.data) {
        // Only author or publisher can add
        let id_author = authUser.id_author;
        if (!id_author && authUser.id_publisher && arg.data.id_author) {
          // publisher can add for their author
          const rel = await db.publisher_author.findFirst({
            where: {
              publisher_id: authUser.id_publisher,
              author_id: arg.data.id_author,
            },
          });
          if (!rel) {
            return {
              success: false,
              message: "Penulis tidak terdaftar di penerbit ini",
            };
          }
          id_author = arg.data.id_author;
        }
        if (!id_author) {
          return { success: false, message: "Akses ditolak" };
        }
        const created = await db.product.create({
          data: {
            ...arg.data,
            id_author,
          },
        });
        return {
          success: true,
          data: created,
          message: "Produk berhasil ditambahkan",
        };
      } else if (arg.action === "update" && arg.id && arg.data) {
        // Only author or publisher can update
        const product = await db.product.findUnique({ where: { id: arg.id } });
        if (!product)
          return { success: false, message: "Produk tidak ditemukan" };
        let allowed = false;
        if (authUser.id_author && product.id_author === authUser.id_author)
          allowed = true;
        if (authUser.id_publisher) {
          const authorId = product.id_author;
          if (authorId) {
            const rel = await db.publisher_author.findFirst({
              where: {
                publisher_id: authUser.id_publisher,
                author_id: authorId,
              },
            });
            if (rel) allowed = true;
          }
        }
        if (!allowed) return { success: false, message: "Akses ditolak" };
        const updated = await db.product.update({
          where: { id: arg.id },
          data: arg.data,
        });
        return {
          success: true,
          data: updated,
          message: "Produk berhasil diperbarui",
        };
      } else if (arg.action === "delete" && arg.id) {
        // Only author or publisher can delete (soft delete)
        const product = await db.product.findUnique({ where: { id: arg.id } });
        if (!product)
          return { success: false, message: "Produk tidak ditemukan" };
        let allowed = false;
        if (authUser.id_author && product.id_author === authUser.id_author)
          allowed = true;
        if (authUser.id_publisher) {
          const authorId = product.id_author;
          if (authorId) {
            const rel = await db.publisher_author.findFirst({
              where: {
                publisher_id: authUser.id_publisher,
                author_id: authorId,
              },
            });
            if (rel) allowed = true;
          }
        }
        if (!allowed) return { success: false, message: "Akses ditolak" };
        await db.product.update({
          where: { id: arg.id },
          data: { deleted_at: new Date() },
        });
        return { success: true, message: "Produk berhasil dihapus" };
      } else {
        return { success: false, message: "Parameter tidak valid" };
      }
    } catch (error) {
      console.error("Error in products API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengelola produk",
      };
    }
  },
});
