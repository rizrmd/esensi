import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "internal_delete",
  url: "/api/internal/internal/delete",
  async handler(arg: { id: string }) {
    const { id } = arg;

    if (!id?.trim()) {
      throw new Error("ID internal wajib diisi");
    }

    // Check if internal exists
    const existing = await db.internal.findUnique({
      where: { id },
      include: {
        book_approval: true,
        auth_user: true,
      },
    });

    if (!existing) throw new Error("Internal tidak ditemukan");

    // Check if internal has any book approvals
    if (existing.book_approval.length > 0) {
      throw new Error(
        "Tidak dapat menghapus internal yang memiliki riwayat persetujuan buku"
      );
    }

    // Check if internal is linked to any users
    if (existing.auth_user.length > 0) {
      throw new Error(
        "Tidak dapat menghapus internal yang terhubung dengan user"
      );
    }

    const result = await db.internal.delete({ where: { id } });

    return {
      success: true,
      message: "Internal berhasil dihapus",
      deleted: result,
    };
  },
});
