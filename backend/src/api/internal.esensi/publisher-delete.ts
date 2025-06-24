import { defineAPI } from "rlib/server";
import type { ApiResponse } from "backend/lib/utils";

export default defineAPI({
  name: "publisher_delete",
  url: "/api/internal/publisher/delete",
  async handler(arg: { id: string }): Promise<ApiResponse<void>> {
    const { id } = arg;

    if (!id?.trim()) {
      throw new Error("ID publisher wajib diisi");
    }

    // Check if publisher exists
    const existing = await db.publisher.findUnique({
      where: { id },
      include: {
        publisher_author: true,
        promo_code: true,
        transaction: true,
        withdrawal: true,
        t_ai_credit: true,
        auth_user: true,
      },
    });

    if (!existing) throw new Error("Publisher tidak ditemukan");

    // Check if publisher has any authors
    if (existing.publisher_author.length > 0)
      throw new Error("Tidak dapat menghapus publisher yang memiliki author");

    // Check if publisher has any promo codes
    if (existing.promo_code.length > 0)
      throw new Error(
        "Tidak dapat menghapus publisher yang memiliki kode promo"
      );

    // Check if publisher has any transactions
    if (existing.transaction.length > 0)
      throw new Error(
        "Tidak dapat menghapus publisher yang memiliki transaksi"
      );

    // Check if publisher has any withdrawals
    if (existing.withdrawal.length > 0)
      throw new Error(
        "Tidak dapat menghapus publisher yang memiliki penarikan"
      );

    // Check if publisher has any AI credits
    if (existing.t_ai_credit.length > 0)
      throw new Error(
        "Tidak dapat menghapus publisher yang memiliki kredit AI"
      );

    // Check if publisher is linked to any users
    if (existing.auth_user.length > 0)
      throw new Error(
        "Tidak dapat menghapus publisher yang terhubung dengan user"
      );

    await db.publisher.delete({ where: { id } });

    return {
      success: true,
      message: "Publisher berhasil dihapus",
    };
  },
});
