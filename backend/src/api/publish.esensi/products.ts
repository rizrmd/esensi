import { defineAPI } from "rlib/server";
import type { User } from "better-auth/types";

export default defineAPI({
  name: "products",
  url: "/api/products",
  async handler(arg: { 
    user: User, 
    page?: number,
    limit?: number,
    search?: string,
    status?: string 
  }) {
    try {
      const page = arg.page || 1;
      const limit = arg.limit || 10;
      const skip = (page - 1) * limit;
      
      // Check if user is publisher or author
      const authUser = await db.auth_user.findUnique({
        where: { id: arg.user.id },
        select: {
          id_author: true,
          id_publisher: true
        }
      });
      
      if (!authUser) {
        return { success: false, message: "Pengguna tidak ditemukan" };
      }

      // Build query conditionals
      const where: any = { deleted_at: null };
      
      // Apply role-specific filtering
      if (authUser.id_author) {
        where.id_author = authUser.id_author;
      } else if (authUser.id_publisher) {
        // For publisher, include products from all associated authors
        const publisherAuthors = await db.publisher_author.findMany({
          where: { publisher_id: authUser.id_publisher },
          select: { author_id: true }
        });
        
        if (publisherAuthors.length > 0) {
          where.id_author = {
            in: publisherAuthors.map(pa => pa.author_id)
          };
        }
      }
      
      // Apply search filter if provided
      if (arg.search) {
        where.OR = [
          { name: { contains: arg.search, mode: 'insensitive' } },
          { slug: { contains: arg.search, mode: 'insensitive' } },
          { desc: { contains: arg.search, mode: 'insensitive' } }
        ];
      }
      
      // Apply status filter if provided
      if (arg.status) {
        where.status = arg.status;
      }

      // Get total count for pagination
      const total = await db.product.count({ where });
      
      // Get paginated results
      const products = await db.product.findMany({
        where,
        include: {
          author: true,
          product_category: {
            include: {
              category: true
            }
          }
        },
        orderBy: {
          published_date: 'desc'
        },
        skip,
        take: limit
      });

      return {
        success: true,
        data: products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { success: false, message: "Gagal mengambil daftar produk" };
    }
  },
});