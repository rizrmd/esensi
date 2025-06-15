import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { notif } from "shared/models";
import type { Notif } from "../../lib/types";

export default defineAPI({
  name: "notif_create",
  url: "/api/internal/notif/create",
  async handler(arg: { data: Partial<notif> }): Promise<ApiResponse<Notif>> {
    try {
      const created = await db.notif.create({
        data: arg.data as any,
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
