import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "internal_get",
  url: "/api/internal/internal/get",
  async handler(arg: {
    id: string;
    include_user?: boolean;
    include_account?: boolean;
    include_book_approvals?: boolean;
  }) {
    const {
      id,
      include_user = false,
      include_account = false,
      include_book_approvals = false,
    } = arg;

    if (!id?.trim()) throw new Error("ID internal wajib diisi");

    const include = {
      ...(include_user && { auth_user: true }),
      ...(include_account && { auth_account: true }),
      ...(include_book_approvals && { book_approval: true }),
    };

    const internal = await db.internal.findUnique({ where: { id }, include });

    if (!internal) throw new Error("Internal tidak ditemukan");

    return internal;
  },
});
