import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { notif } from "shared/models";
import type { Notif } from "../../lib/types";

export default defineAPI({
  name: "notif_update",
  url: "/api/internal/notif/update",
  async handler(arg: {
    id_user: string;
    created_at: Date;
    data: Partial<notif>;
  }): Promise<ApiResponse<Notif>> {
    try {
      const notif = await db.notif.findUnique({
        where: {
          id_user_created_at: {
            id_user: arg.id_user,
            created_at: arg.created_at,
          },
        },
      });
      if (!notif) return { success: false, message: "Notif tidak ditemukan" };

      const updated = await db.notif.update({
        where: {
          id_user_created_at: {
            id_user: arg.id_user,
            created_at: arg.created_at,
          },
        },
        data: { status: arg.data.status! },
        include: { auth_user: true },
      });

      return {
        success: true,
        data: updated,
        message: "Notifikasi berhasil diperbarui",
      };
    } catch (error) {
      console.error("Error in notif update API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam memperbarui notifikasi",
      };
    }
  },
});
