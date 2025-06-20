import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "customer_delete",
  url: "/api/internal/customer/delete",
  async handler(arg: { id: string; hard_delete?: boolean }) {
    const { id, hard_delete = false } = arg;

    if (!id?.trim()) {
      throw new Error("ID customer wajib diisi");
    }

    // Check if customer exists
    const existing = await db.customer.findUnique({
      where: { id },
      include: {
        t_sales: true,
        customer_track: true,
        customer_reader: true,
        auth_user: true,
      },
    });

    if (!existing) throw new Error("Customer tidak ditemukan");

    // If hard delete is requested, check for dependencies
    if (hard_delete) {
      // Check if customer has any sales
      if (existing.t_sales.length > 0) {
        throw new Error(
          "Tidak dapat menghapus permanen customer yang memiliki transaksi penjualan"
        );
      }

      // Check if customer has any tracking records
      if (existing.customer_track.length > 0) {
        throw new Error(
          "Tidak dapat menghapus permanen customer yang memiliki riwayat tracking"
        );
      }

      // Check if customer has any reader records
      if (existing.customer_reader.length > 0) {
        throw new Error(
          "Tidak dapat menghapus permanen customer yang memiliki riwayat pembacaan"
        );
      }

      // Hard delete - permanently remove from database
      const result = await db.customer.delete({ where: { id } });

      return {
        success: true,
        message: "Customer berhasil dihapus permanen",
        deleted: result,
      };
    } else {
      // Soft delete - set deleted_at timestamp
      const result = await db.customer.update({
        where: { id },
        data: { deleted_at: new Date() },
      });

      return {
        success: true,
        message: "Customer berhasil dihapus",
        deleted: result,
      };
    }
  },
});
