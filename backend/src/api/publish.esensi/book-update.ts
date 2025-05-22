import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { book } from "shared/models";
import type { Book } from "../types";

export default defineAPI({
  name: "book_update",
  url: "/api/publish/book/update",
  async handler(arg: {
    id: string;
    data: Partial<book>;
  }): Promise<ApiResponse<Book>> {
    try {
      const book = await db.book.findUnique({ where: { id: arg.id } });
      if (!book) {
        return { success: false, message: "Buku tidak ditemukan" };
      }

      const updated = await db.book.update({
        where: { id: arg.id },
        data: {
          name: arg.data.name,
          slug: arg.data.slug,
          alias: arg.data.alias,
          submitted_price: arg.data.submitted_price,
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
          is_chapter: arg.data.is_chapter,
          content_type: arg.data.content_type,
        },
        include: {
          author: true,
          book_approval: {
            orderBy: {
              created_at: "desc",
            },
          },
        },
      });

      const oldFields: Partial<book> = {};
      const newFields: Partial<book> = {};
      
      if (book.name !== updated.name) {
        oldFields.name = book.name;
        newFields.name = updated.name;
      }
      if (book.slug !== updated.slug) {
        oldFields.slug = book.slug;
        newFields.slug = updated.slug;
      }
      if (book.alias !== updated.alias) {
        oldFields.alias = book.alias;
        newFields.alias = updated.alias;
      }
      if (Number(book.submitted_price) !== Number(updated.submitted_price)) {
        oldFields.submitted_price = book.submitted_price;
        newFields.submitted_price = updated.submitted_price;
      }
      if (book.desc !== updated.desc) {
        oldFields.desc = book.desc;
        newFields.desc = updated.desc;
      }
      if (book.info?.toString() !== updated.info?.toString()) {
        oldFields.info = book.info;
        newFields.info = updated.info;
      }
      if (book.status !== updated.status) {
        oldFields.status = book.status;
        newFields.status = updated.status;
      }
      if (book.currency !== updated.currency) {
        oldFields.currency = book.currency;
        newFields.currency = updated.currency;
      }
      if (book.img_file !== updated.img_file) {
        oldFields.img_file = book.img_file;
        newFields.img_file = updated.img_file;
      }
      if (book.cover !== updated.cover) {
        oldFields.cover = book.cover;
        newFields.cover = updated.cover;
      }
      if (book.product_file !== updated.product_file) {
        oldFields.product_file = book.product_file;
        newFields.product_file = updated.product_file;
      }
      if (book.sku !== updated.sku) {
        oldFields.sku = book.sku;
        newFields.sku = updated.sku;
      }
      if (book.id_author !== updated.id_author) {
        oldFields.id_author = book.id_author;
        newFields.id_author = updated.id_author;
      }
      if (book.is_physical !== updated.is_physical) {
        oldFields.is_physical = book.is_physical;
        newFields.is_physical = updated.is_physical;
      }
      if (book.is_chapter !== updated.is_chapter) {
        oldFields.is_chapter = book.is_chapter;
        newFields.is_chapter = updated.is_chapter;
      }
      if (book.content_type !== updated.content_type) {
        oldFields.content_type = book.content_type;
        newFields.content_type = updated.content_type;
      }

      if (Object.keys(newFields).length > 0) {
        await db.book_changes_log.create({
          data: {
            id_book: updated.id,
            created_at: new Date(),
            changes: { oldFields, newFields },
          },
        });
      }

      return {
        success: true,
        data: updated,
        message: "Buku berhasil diperbarui",
      };
    } catch (error) {
      console.error("Error in book update API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam memperbarui buku",
      };
    }
  },
});
