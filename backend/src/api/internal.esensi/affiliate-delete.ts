import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "affiliate_delete",
  url: "/api/internal/affiliate/delete",
  async handler(arg: { id: string }) {
    const { id } = arg;

    if (!id?.trim()) throw new Error("ID affiliate wajib diisi");

    // Check if affiliate exists
    const existing = await db.affiliate.findUnique({
      where: { id },
      include: {
        auth_user: true,
      },
    });

    if (!existing) throw new Error("Affiliate tidak ditemukan");

    // Check if affiliate is linked to any users
    if (existing.auth_user.length > 0)
      throw new Error(
        "Tidak dapat menghapus affiliate yang terhubung dengan user"
      );

    const result = await db.affiliate.delete({ where: { id } });

    return {
      success: true,
      message: "Affiliate berhasil dihapus",
      deleted: result,
    };
  },
});
