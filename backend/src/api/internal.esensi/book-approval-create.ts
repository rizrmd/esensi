import { baseUrl } from "backend/gen/base-url";
import {
  NotifStatus,
  NotifType,
  sendNotif,
  WSMessageAction,
} from "backend/lib/notif";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import { BookStatus, type BookApproval } from "../../lib/types";

export default defineAPI({
  name: "book_approval_create",
  url: "/api/internal/book-approval/create",
  async handler(arg: {
    id_book: string;
    comment: string;
    id_internal?: string;
    status?: BookStatus;
  }): Promise<ApiResponse<BookApproval>> {
    try {
      const book = await db.book.findUnique({ where: { id: arg.id_book } });
      if (!book) {
        return { success: false, message: "Buku tidak ditemukan" };
      }

      const created = await db.book_approval.create({
        data: {
          id_book: arg.id_book,
          comment: arg.comment,
          id_internal: arg.id_internal,
          status: arg.status,
        },
        include: {
          book: {
            include: {
              author: {
                include: { auth_user: true },
              },
            },
          },
          internal: true,
        },
      });

      if (!created) {
        return {
          success: false,
          message: "Gagal menambahkan riwayat buku",
        };
      } else {
        await db.book.update({
          where: { id: arg.id_book },
          data: { status: arg.status },
        });
      }

      const uid =
        created.book.author?.id_user || created.book.author?.auth_user[0]?.id;
      if (uid) {
        const notif = {
          id_user: uid,
          data: {
            bookId: created.id_book,
            approverId: arg.id_internal!,
          },
          status: NotifStatus.UNREAD,
          timestamp: created.created_at.getTime(),
          thumbnail: created.book.cover,
        };
        if (arg.status === BookStatus.PUBLISHED) {
          const url = baseUrl.publish_esensi + "/book-sales?id=" + arg.id_book;
          await sendNotif(uid, {
            action: WSMessageAction.NEW_NOTIF,
            notif: {
              message: "Buku anda telah disetujui untuk terbit",
              type: NotifType.BOOK_PUBLISH,
              url,
              ...notif,
            },
          });
        } else if (arg.status === BookStatus.REJECTED) {
          const url = baseUrl.publish_esensi + "/book-detail?id=" + arg.id_book;
          await sendNotif(uid, {
            action: WSMessageAction.NEW_NOTIF,
            notif: {
              message: "Buku anda telah ditolak",
              type: NotifType.BOOK_REJECT,
              url,
              ...notif,
            },
          });
        } else if (
          book.status === BookStatus.SUBMITTED &&
          arg.status === BookStatus.DRAFT
        ) {
          const url = baseUrl.publish_esensi + "/book-update?id=" + arg.id_book;
          await sendNotif(uid, {
            action: WSMessageAction.NEW_NOTIF,
            notif: {
              message: "Buku anda harus direvisi",
              type: NotifType.BOOK_REVISE,
              url,
              ...notif,
            },
          });
        }
      }

      return {
        success: true,
        data: created,
        message: "Riwayat buku berhasil ditambahkan",
      };
    } catch (error) {
      console.error("Error in book approval create API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam menambahkan riwayat buku",
      };
    }
  },
});
