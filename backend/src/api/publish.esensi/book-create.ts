import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { book } from "shared/models";
import type { Book } from "../types";

export default defineAPI({
  name: "book_create",
  url: "/api/publish/book/create",
  async handler(arg: { data: Partial<book> }): Promise<ApiResponse<Book>> {
    try {
      const _created = await db.book.create({
        data: arg.data as any,
      });

      await db.book_changes_log.create({
        data: {
          id_book: _created.id,
          created_at: new Date(),
          changes: JSON.stringify(arg.data),
        },
      });

      const created = await db.book.findUnique({
        where: { id: _created.id },
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
        },
      });

      if (!created) {
        return { success: false, message: "Buku tidak ditemukan" };
      } else {
        created.book_changes_log = created.book_changes_log.map((log) => ({
          ...log,
          hash_value: `${log.id_book}_${log.created_at.getTime()}`,
        }));
      }

      return {
        success: true,
        data: created,
        message: "Buku berhasil ditambahkan",
      };
    } catch (error) {
      console.error("Error in book create API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam menambahkan buku",
      };
    }
  },
});
