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

      const _updated = await db.book.update({
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
      });

      const oldFields: Partial<book> = {};
      const newFields: Partial<book> = {};

      if (book.name !== _updated.name) {
        oldFields.name = book.name;
        newFields.name = _updated.name;
      }
      if (book.slug !== _updated.slug) {
        oldFields.slug = book.slug;
        newFields.slug = _updated.slug;
      }
      if (book.alias !== _updated.alias) {
        oldFields.alias = book.alias;
        newFields.alias = _updated.alias;
      }
      if (Number(book.submitted_price) !== Number(_updated.submitted_price)) {
        oldFields.submitted_price = book.submitted_price;
        newFields.submitted_price = _updated.submitted_price;
      }
      if (book.desc !== _updated.desc) {
        oldFields.desc = book.desc;
        newFields.desc = _updated.desc;
      }
      if (book.info?.toString() !== _updated.info?.toString()) {
        oldFields.info = book.info;
        newFields.info = _updated.info;
      }
      if (book.status !== _updated.status) {
        oldFields.status = book.status;
        newFields.status = _updated.status;
      }
      if (book.currency !== _updated.currency) {
        oldFields.currency = book.currency;
        newFields.currency = _updated.currency;
      }
      if (book.img_file !== _updated.img_file) {
        oldFields.img_file = book.img_file;
        newFields.img_file = _updated.img_file;
      }
      if (book.cover !== _updated.cover) {
        oldFields.cover = book.cover;
        newFields.cover = _updated.cover;
      }
      if (book.product_file !== _updated.product_file) {
        oldFields.product_file = book.product_file;
        newFields.product_file = _updated.product_file;
      }
      if (book.sku !== _updated.sku) {
        oldFields.sku = book.sku;
        newFields.sku = _updated.sku;
      }
      if (book.id_author !== _updated.id_author) {
        oldFields.id_author = book.id_author;
        newFields.id_author = _updated.id_author;
      }
      if (book.is_physical !== _updated.is_physical) {
        oldFields.is_physical = book.is_physical;
        newFields.is_physical = _updated.is_physical;
      }
      if (book.is_chapter !== _updated.is_chapter) {
        oldFields.is_chapter = book.is_chapter;
        newFields.is_chapter = _updated.is_chapter;
      }
      if (book.content_type !== _updated.content_type) {
        oldFields.content_type = book.content_type;
        newFields.content_type = _updated.content_type;
      }

      if (Object.keys(newFields).length > 0) {
        await db.book_changes_log.create({
          data: {
            id_book: _updated.id,
            created_at: new Date(),
            changes: { oldFields, newFields },
          },
        });
      }

      const updated = await db.book.findUnique({
        where: { id: _updated.id },
        include: {
          author: true,
          book_approval: {
            orderBy: {
              created_at: "desc",
            },
          },
          book_changes_log: {
            orderBy: {
              created_at: "asc",
            },
          },
          product: true,
        },
      });

      if (!updated) return { success: false, message: "Buku tidak ditemukan" };
      else {
        updated.book_changes_log = updated.book_changes_log.map((log) => ({
          ...log,
          hash_value: `${log.id_book}_${log.created_at.getTime()}`,
        }));
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
