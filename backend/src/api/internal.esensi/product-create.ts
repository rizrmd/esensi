import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { Book, Product } from "../../lib/types";

export default defineAPI({
  name: "product_create",
  url: "/api/internal/product/create",
  async handler(arg: {
    user: Partial<User>;
    data: Book;
  }): Promise<ApiResponse<Product>> {
    try {
      const created = await db.product.create({
        data: {
          name: arg.data.name,
          slug: arg.data.slug,
          alias: arg.data.alias,
          strike_price: arg.data.submitted_price,
          real_price: arg.data.submitted_price,
          desc: arg.data.desc,
          info: arg.data.info ?? {},
          status: arg.data.status,
          currency: arg.data.currency,
          img_file: arg.data.img_file,
          cover: arg.data.cover,
          product_file: arg.data.product_file,
          sku: arg.data.sku,
          id_author: arg.data.id_author,
          is_physical: arg.data.is_physical,
          content_type: arg.data.content_type,
        },
        include: {
          author: true,
          bundle_product: {
            select: {
              bundle: true,
            },
            take: 10,
          },
          product_category: {
            select: {
              category: true,
            },
            take: 10,
          },
        },
      });

      if (!created) {
        return {
          success: false,
          message: "Gagal membuat produk",
        };
      } else {
        await db.book.update({
          where: { id: arg.data.id },
          data: { id_product: created.id },
        });
      }

      return {
        success: true,
        data: created,
        message: "Produk berhasil ditambahkan",
      };
    } catch (error) {
      console.error("Error in products create API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam menambahkan produk",
      };
    }
  },
});
