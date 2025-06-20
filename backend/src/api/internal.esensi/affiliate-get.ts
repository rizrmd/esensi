import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "affiliate_get",
  url: "/api/internal/affiliate/get",
  async handler(arg: {
    id: string;
    include_user?: boolean;
    include_account?: boolean;
  }) {
    const { id, include_user = false, include_account = false } = arg;

    if (!id?.trim()) throw new Error("ID affiliate wajib diisi");

    const include = {
      ...(include_user && { auth_user: true }),
      ...(include_account && { auth_account: true }),
    };

    const affiliate = await db.affiliate.findUnique({
      where: { id },
      include,
    });

    if (!affiliate) throw new Error("Affiliate tidak ditemukan");

    return affiliate;
  },
});
