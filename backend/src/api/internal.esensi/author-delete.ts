import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "author_delete",
  url: "/api/internal/author/delete",
  async handler(arg: { id: string }) {
    const { id } = arg;

    if (!id?.trim()) {
      throw new Error("ID author wajib diisi");
    }

    // Check if author exists
    const existing = await db.author.findUnique({
      where: { id },
      include: {
        book: true,
        product: true,
        publisher_author: true,
      },
    });

    if (!existing) {
      throw new Error("Author tidak ditemukan");
    }

    // Check if author has any books or products
    if (existing.book.length > 0 || existing.product.length > 0) {
      throw new Error(
        "Tidak dapat menghapus author yang memiliki buku atau produk"
      );
    }

    // Check if author is linked to any publishers
    if (existing.publisher_author.length > 0) {
      throw new Error(
        "Tidak dapat menghapus author yang terhubung dengan publisher"
      );
    }

    const result = await db.author.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Author berhasil dihapus",
      deleted: result,
    };
  },
});
