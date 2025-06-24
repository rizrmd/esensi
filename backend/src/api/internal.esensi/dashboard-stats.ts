import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import { BadgeStatus } from "../../lib/types";
import type { DashboardStatsData } from "../../lib/types";

export default defineAPI({
  name: "dashboard_stats",
  url: "/api/internal/dashboard/stats",
  async handler(arg: { period?: string }): Promise<ApiResponse<DashboardStatsData>> {
    const { period = "30" } = arg;

    // Calculate date range
    const daysAgo = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    try {
      // Get overall statistics
      const [
        totalAuthors,
        totalBooks,
        totalCustomers,
        totalSales,
        recentSales,
        topAuthors,
        topBooks,
        salesByMonth,
      ] = await Promise.all([
        // Total authors
        db.author.count(),

        // Total books
        db.book.count({
          where: {
            deleted_at: null,
          },
        }),

        // Total customers
        db.customer.count(),

        // Total sales (paid only)
        db.t_sales.aggregate({
          where: {
            status: BadgeStatus.PAID,
            created_at: {
              gte: startDate,
            },
          },
          _sum: {
            total: true,
          },
          _count: {
            id: true,
          },
        }),

        // Recent sales
        db.t_sales_line.findMany({
          where: {
            t_sales: {
              status: BadgeStatus.PAID,
              created_at: {
                gte: startDate,
              },
            },
          },
          include: {
            t_sales: {
              include: {
                customer: {
                  include: {
                    auth_user: {
                      select: {
                        name: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
            product: {
              include: {
                book: {
                  include: {
                    author: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            t_sales: {
              created_at: "desc",
            },
          },
          take: 10,
        }),

        // Top authors by sales
        db.$queryRaw`
          SELECT 
            a.id,
            a.name,
            COUNT(DISTINCT b.id) as book_count,
            COUNT(tsl.id) as total_sales,
            COALESCE(SUM(tsl.total_price), 0) as total_revenue
          FROM author a
          LEFT JOIN book b ON a.id = b.id_author AND b.deleted_at IS NULL
          LEFT JOIN product p ON b.id_product = p.id
          LEFT JOIN t_sales_line tsl ON p.id = tsl.id_product
          LEFT JOIN t_sales ts ON tsl.id_sales = ts.id AND ts.status = '${BadgeStatus.PAID}'
          WHERE ts.created_at >= ${startDate}
          GROUP BY a.id, a.name
          HAVING COUNT(tsl.id) > 0
          ORDER BY total_revenue DESC
          LIMIT 10
        `,

        // Top books by sales
        db.$queryRaw`
          SELECT 
            b.id,
            b.name,
            a.name as author_name,
            COUNT(tsl.id) as total_sales,
            COALESCE(SUM(tsl.total_price), 0) as total_revenue,
            COALESCE(SUM(tsl.qty), 0) as total_quantity
          FROM book b
          LEFT JOIN author a ON b.id_author = a.id
          LEFT JOIN product p ON b.id_product = p.id
          LEFT JOIN t_sales_line tsl ON p.id = tsl.id_product
          LEFT JOIN t_sales ts ON tsl.id_sales = ts.id AND ts.status = '${BadgeStatus.PAID}'
          WHERE b.deleted_at IS NULL AND ts.created_at >= ${startDate}
          GROUP BY b.id, b.name, a.name
          HAVING COUNT(tsl.id) > 0
          ORDER BY total_revenue DESC
          LIMIT 10
        `,

        // Sales by month (last 6 months)
        db.$queryRaw`
          SELECT 
            DATE_TRUNC('month', ts.created_at) as month,
            COUNT(tsl.id) as sales_count,
            COALESCE(SUM(tsl.total_price), 0) as total_revenue
          FROM t_sales_line tsl
          JOIN t_sales ts ON tsl.id_sales = ts.id
          WHERE ts.status = '${BadgeStatus.PAID}'
            AND ts.created_at >= NOW() - INTERVAL '6 months'
          GROUP BY DATE_TRUNC('month', ts.created_at)
          ORDER BY month DESC
        `,
      ]);

      return {
        success: true,
        data: {
          overview: {
            total_authors: totalAuthors,
            total_books: totalBooks,
            total_customers: totalCustomers,
            total_sales_count: totalSales._count.id || 0,
            total_sales_revenue: Number(totalSales._sum.total) || 0,
            period_days: daysAgo,
          },
          recent_sales: recentSales as unknown[],
          top_authors: topAuthors as unknown[],
          top_books: topBooks as unknown[],
          sales_by_month: salesByMonth as unknown[],
        },
      };
    } catch (error) {
      console.error("Dashboard stats error:", error);
      throw new Error("Gagal memuat statistik dashboard");
    }
  },
});
