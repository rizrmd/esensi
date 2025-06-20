import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "bundle_stats",
  url: "/api/publish/bundle/stats",
  async handler(arg: {
    user: Partial<User>;
    id?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<ApiResponse<any>> {
    try {
      const { id, date_from, date_to } = arg;

      if (id) {
        // Get stats for specific bundle
        const bundle = await db.bundle.findFirst({
          where: { id, deleted_at: null },
          include: {
            bundle_product: {
              include: {
                product: true,
              },
            },
            bundle_category: {
              include: {
                category: true,
              },
            },
            t_sales_line: {
              include: {
                t_sales: true,
              },
              where:
                date_from || date_to
                  ? {
                      t_sales: {
                        created_at: {
                          ...(date_from && { gte: new Date(date_from) }),
                          ...(date_to && { lte: new Date(date_to) }),
                        },
                      },
                    }
                  : undefined,
            },
          },
        });

        if (!bundle) {
          return {
            success: false,
            message: "Bundle tidak ditemukan",
          };
        }

        // Calculate stats
        const totalSales = bundle.t_sales_line.reduce(
          (sum, sale) => sum + sale.qty,
          0
        );
        const totalRevenue = bundle.t_sales_line.reduce(
          (sum, sale) => sum + Number(sale.total_price),
          0
        );
        const uniqueCustomers = new Set(
          bundle.t_sales_line.map((sale) => sale.t_sales.id_customer)
        ).size;

        return {
          success: true,
          data: {
            bundle: {
              id: bundle.id,
              name: bundle.name,
              slug: bundle.slug,
              status: bundle.status,
              real_price: bundle.real_price,
              strike_price: bundle.strike_price,
            },
            product_count: bundle.bundle_product.length,
            category_count: bundle.bundle_category.length,
            sales_stats: {
              total_sales: totalSales,
              total_revenue: totalRevenue,
              unique_customers: uniqueCustomers,
              average_order_value:
                totalSales > 0 ? totalRevenue / totalSales : 0,
            },
          },
          message: "Statistik bundle berhasil diambil",
        };
      } else {
        // Get overall bundle stats
        const dateFilter =
          date_from || date_to
            ? {
                created_at: {
                  ...(date_from && { gte: new Date(date_from) }),
                  ...(date_to && { lte: new Date(date_to) }),
                },
              }
            : undefined;

        const [
          totalBundles,
          activeBundles,
          draftBundles,
          publishedBundles,
          deletedBundles,
          bundlesWithProducts,
          bundlesWithCategories,
          salesData,
        ] = await Promise.all([
          db.bundle.count({
            where: { deleted_at: null },
          }),
          db.bundle.count({
            where: { deleted_at: null, status: "active" },
          }),
          db.bundle.count({
            where: { deleted_at: null, status: "draft" },
          }),
          db.bundle.count({
            where: { deleted_at: null, status: "published" },
          }),
          db.bundle.count({
            where: { deleted_at: { not: null } },
          }),
          db.bundle.count({
            where: {
              deleted_at: null,
              bundle_product: {
                some: {},
              },
            },
          }),
          db.bundle.count({
            where: {
              deleted_at: null,
              bundle_category: {
                some: {},
              },
            },
          }),
          db.t_sales_line.aggregate({
            where: {
              id_bundle: { not: null },
              ...(dateFilter && { t_sales: dateFilter }),
            },
            _sum: {
              qty: true,
              total_price: true,
            },
            _count: {
              id: true,
            },
          }),
        ]);

        return {
          success: true,
          data: {
            bundle_counts: {
              total: totalBundles,
              active: activeBundles,
              draft: draftBundles,
              published: publishedBundles,
              deleted: deletedBundles,
              with_products: bundlesWithProducts,
              with_categories: bundlesWithCategories,
              empty: totalBundles - bundlesWithProducts,
            },
            sales_stats: {
              total_sales: salesData._sum.qty || 0,
              total_revenue: Number(salesData._sum.total_price) || 0,
              total_orders: salesData._count.id || 0,
              average_order_value:
                salesData._sum.qty && salesData._sum.total_price
                  ? Number(salesData._sum.total_price) / salesData._sum.qty
                  : 0,
            },
          },
          message: "Statistik keseluruhan bundle berhasil diambil",
        };
      }
    } catch (error) {
      console.error("Error in bundle stats API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam mengambil statistik bundle",
      };
    }
  },
});
