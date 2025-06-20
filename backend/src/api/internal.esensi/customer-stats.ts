import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "customer_stats",
  url: "/api/internal/customer/stats",
  async handler(arg: { id?: string }) {
    const { id } = arg;

    if (id) {
      // Get stats for specific customer
      const customer = await db.customer.findUnique({
        where: { id, deleted_at: null },
        select: {
          id: true,
          name: true,
          email: true,
          whatsapp: true,
          _count: {
            select: {
              t_sales: true,
              customer_track: true,
              customer_reader: true,
              auth_user: true,
            },
          },
        },
      });

      if (!customer) {
        throw new Error("Customer tidak ditemukan");
      }

      // Get total sales amount
      const salesTotal = await db.t_sales.aggregate({
        where: { id_customer: id, deleted_at: null },
        _sum: { total: true },
      });

      return {
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          whatsapp: customer.whatsapp,
          sales_count: customer._count.t_sales,
          sales_total: salesTotal._sum?.total || 0,
          track_count: customer._count.customer_track,
          reader_count: customer._count.customer_reader,
          user_count: customer._count.auth_user,
        },
      };
    } else {
      // Get overall stats
      const [
        totalCustomers,
        activeCustomers,
        customersWithSales,
        customersWithTracks,
        customersWithReader,
        customersWithUser,
      ] = await Promise.all([
        db.customer.count({ where: { deleted_at: null } }),
        db.customer.count({
          where: { deleted_at: null, t_sales: { some: {} } },
        }),
        db.customer.count({
          where: { deleted_at: null, t_sales: { some: {} } },
        }),
        db.customer.count({
          where: { deleted_at: null, customer_track: { some: {} } },
        }),
        db.customer.count({
          where: { deleted_at: null, customer_reader: { some: {} } },
        }),
        db.customer.count({
          where: { deleted_at: null, auth_user: { some: {} } },
        }),
      ]);

      // Get total sales amount
      const totalSalesAmount = await db.t_sales.aggregate({
        where: { deleted_at: null },
        _sum: { total: true },
      });

      return {
        overview: {
          total_customers: totalCustomers,
          active_customers: activeCustomers,
          customers_with_sales: customersWithSales,
          customers_with_tracks: customersWithTracks,
          customers_with_reader: customersWithReader,
          customers_with_user: customersWithUser,
          total_sales_amount: totalSalesAmount._sum?.total || 0,
        },
      };
    }
  },
});
