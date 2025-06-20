import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "publisher_get",
  url: "/api/internal/publisher/get",
  async handler(arg: {
    id: string;
    include_user?: boolean;
    include_account?: boolean;
    include_authors?: boolean;
    include_promo_codes?: boolean;
    include_transactions?: boolean;
    include_withdrawals?: boolean;
    include_ai_credit?: boolean;
  }) {
    const {
      id,
      include_user = false,
      include_account = false,
      include_authors = false,
      include_promo_codes = false,
      include_transactions = false,
      include_withdrawals = false,
      include_ai_credit = false,
    } = arg;

    if (!id?.trim()) throw new Error("ID publisher wajib diisi");

    const include = {
      ...(include_user && { auth_user: true }),
      ...(include_account && { auth_account: true }),
      ...(include_authors && { publisher_author: { include: { author: true } } }),
      ...(include_promo_codes && { promo_code: true }),
      ...(include_transactions && { transaction: true }),
      ...(include_withdrawals && { withdrawal: true }),
      ...(include_ai_credit && { t_ai_credit: true }),
    };

    const publisher = await db.publisher.findUnique({ 
      where: { id }, 
      include 
    });

    if (!publisher) throw new Error("Publisher tidak ditemukan");

    return publisher;
  },
});
