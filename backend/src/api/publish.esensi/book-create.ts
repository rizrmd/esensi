import { baseUrl } from "backend/gen/base-url";
import {
  NotifStatus,
  NotifType,
  sendNotif,
  WSMessageAction,
} from "backend/lib/notif";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { book } from "shared/models";
import { BookStatus, type Book } from "../../lib/types";

export default defineAPI({
  name: "book_create",
  url: "/api/publish/book/create",
  async handler(arg: { data: Partial<book> }): Promise<ApiResponse<Book>> {
    try {
      const _created = await db.book.create({
        data: arg.data as any,
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
          product: true,
          chapter: {
            take: 10,
          },
        },
      });

      if (!created) return { success: false, message: "Buku tidak ditemukan" };
      else {
        created.book_changes_log = created.book_changes_log.map((log) => ({
          ...log,
          hash_value: `${log.id_book}_${log.created_at.getTime()}`,
        }));

        if (arg.data.status === BookStatus.SUBMITTED) {
          const list = await db.auth_user.findMany({
            where: { id_internal: { not: null } },
            select: { id: true },
          });
          const internals = new Set(list.flatMap((x) => x.id));

          for (const id_user of internals) {
            const notif = {
              id_user,
              data: {
                bookId: created.id,
                submitterId: arg.data.id_author!,
              },
              url: baseUrl.internal_esensi + "/book-approval?id=" + created.id,
              status: NotifStatus.UNREAD,
              timestamp: new Date().getTime(),
              thumbnail: arg.data.cover,
            };
            await sendNotif(id_user!, {
              action: WSMessageAction.NEW_NOTIF,
              notif: {
                message:
                  created.author?.name +
                  " mengajukan buku " +
                  created.name +
                  ", untuk dusetujui",
                type: NotifType.BOOK_SUBMIT,
                ...notif,
              },
            });
          }
        }
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
