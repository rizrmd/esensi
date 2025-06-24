import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "affiliate_stats",
  url: "/api/internal/affiliate/stats",
  async handler(arg: { id?: string }): Promise<
    ApiResponse<{
      total_affiliates?: number;
      affiliates_with_users?: number;
      affiliates_with_account?: number;
      affiliate?: {
        id: string;
        name: string;
        user_count: number;
      };
    }>
  > {
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
        success: true,
        data: {
          affiliate: {
            id: affiliate.id,
            name: affiliate.name,
            user_count: affiliate._count.auth_user,
          },
        },
        message: "Statistik affiliate berhasil diambil",
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
        success: true,
        data: {
          total_affiliates: totalAffiliates,
          affiliates_with_users: affiliatesWithUsers,
          affiliates_with_account: affiliatesWithAccount,
        },
        message: "Statistik affiliate berhasil diambil",
      };
    }
  },
});
