import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "affiliate_stats",
  url: "/api/internal/affiliate/stats",
  async handler(arg: { id?: string }) {
    const { id } = arg;

    if (id) {
      // Get stats for specific affiliate
      const affiliate = await db.affiliate.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          _count: { select: { auth_user: true } },
        },
      });

      if (!affiliate) throw new Error("Affiliate tidak ditemukan");

      return {
        affiliate: {
          id: affiliate.id,
          name: affiliate.name,
          user_count: affiliate._count.auth_user,
        },
      };
    } else {
      // Get overall stats
      const [totalAffiliates, affiliatesWithUsers, affiliatesWithAccount] =
        await Promise.all([
          db.affiliate.count(),
          db.affiliate.count({ where: { auth_user: { some: {} } } }),
          db.affiliate.count({ where: { id_account: { not: null } } }),
        ]);

      return {
        overview: {
          total_affiliates: totalAffiliates,
          affiliates_with_users: affiliatesWithUsers,
          affiliates_with_account: affiliatesWithAccount,
        },
      };
    }
  },
});
