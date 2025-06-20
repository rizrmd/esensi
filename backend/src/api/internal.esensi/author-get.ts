import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "author_get",
  url: "/api/internal/author/get",
  async handler(arg: {
    id: string;
    include_user?: boolean;
    include_account?: boolean;
    include_books?: boolean;
    include_products?: boolean;
  }) {
    const {
      id,
      include_user = false,
      include_account = false,
      include_books = false,
      include_products = false,
    } = arg;

    if (!id?.trim()) {
      throw new Error("ID author wajib diisi");
    }

    const include = {
      ...(include_user && { auth_user: true }),
      ...(include_account && { auth_account: true }),
      ...(include_books && { book: true }),
      ...(include_products && { product: true }),
    };

    const author = await db.author.findUnique({
      where: { id },
      include,
    });

    if (!author) {
      throw new Error("Author tidak ditemukan");
    }

    return author;
  },
});
