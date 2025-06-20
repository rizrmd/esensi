import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "internal_stats",
  url: "/api/internal/internal/stats",
  async handler(arg: { id?: string }) {
    const { id } = arg;

    if (id) {
      // Get stats for specific internal
      const internal = await db.internal.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          is_sales_and_marketing: true,
          is_support: true,
          is_management: true,
          is_it: true,
          _count: {
            select: { auth_user: true, book_approval: true },
          },
        },
      });

      if (!internal) throw new Error("Internal tidak ditemukan");

      return {
        internal: {
          id: internal.id,
          name: internal.name,
          roles: {
            sales_and_marketing: internal.is_sales_and_marketing,
            support: internal.is_support,
            management: internal.is_management,
            it: internal.is_it,
          },
          user_count: internal._count.auth_user,
          book_approval_count: internal._count.book_approval,
        },
      };
    } else {
      // Get overall stats
      const [
        totalInternals,
        salesAndMarketingCount,
        supportCount,
        managementCount,
        itCount,
        internalsWithUsers,
        internalsWithBookApprovals,
      ] = await Promise.all([
        db.internal.count(),
        db.internal.count({ where: { is_sales_and_marketing: true } }),
        db.internal.count({ where: { is_support: true } }),
        db.internal.count({ where: { is_management: true } }),
        db.internal.count({ where: { is_it: true } }),
        db.internal.count({ where: { auth_user: { some: {} } } }),
        db.internal.count({ where: { book_approval: { some: {} } } }),
      ]);

      // Get total book approvals
      const totalBookApprovals = await db.book_approval.count();

      return {
        overview: {
          total_internals: totalInternals,
          roles: {
            sales_and_marketing: salesAndMarketingCount,
            support: supportCount,
            management: managementCount,
            it: itCount,
          },
          internals_with_users: internalsWithUsers,
          internals_with_book_approvals: internalsWithBookApprovals,
          total_book_approvals: totalBookApprovals,
        },
      };
    }
  },
});
