import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "affiliate_create",
  url: "/api/internal/affiliate/create",
  async handler(arg: { name: string; id_account?: string; id_user?: string }) {
    const { name, id_account, id_user } = arg;

    // Validate required fields
    if (!name?.trim()) throw new Error("Nama affiliate wajib diisi");

    // Check if affiliate with same name already exists
    const existing = await db.affiliate.findFirst({
      where: { name: name.trim() },
    });

    if (existing) throw new Error("Affiliate dengan nama tersebut sudah ada");

    const result = await db.affiliate.create({
      data: {
        name: name.trim(),
        id_account: id_account || null,
        id_user: id_user || null,
      },
      include: { auth_user: true, auth_account: true },
    });

    return result;
  },
});
