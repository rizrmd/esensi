import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { notif } from "shared/models";
import type { Notif } from "../../lib/types";

export default defineAPI({
  name: "notif_create",
  url: "/api/publish/notif/create",
  async handler(arg: { data: Partial<notif> }): Promise<ApiResponse<Notif>> {
    try {
      const _created = await db.notif.create({
        data: arg.data as any,
      });

      const created = await db.notif.findUnique({
        where: {
          id_user_created_at: {
            id_user: _created.id_user,
            created_at: _created.created_at,
          },
        },
        include: { auth_user: true },
      });

      if (!created)
        return { success: false, message: "Notifikasi tidak ditemukan" };

      return {
        success: true,
        data: created,
        message: "Notifikasi berhasil ditambahkan",
      };
    } catch (error) {
      console.error("Error in notif create API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam menambahkan notifikasi",
      };
    }
  },
});
