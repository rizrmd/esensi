import type { User } from "backend/lib/better-auth";
import { defineAPI } from "rlib/server";
import type { ApiResponse } from "backend/lib/utils";
import { BadgeStatus } from "../../lib/types";
import type { DashboardStatsData } from "../../lib/types";

export default defineAPI({
  name: "dashboard_stats",
  url: "/api/publish/dashboard/stats",
  async handler(arg: { user: Partial<User>; period?: string }): Promise<ApiResponse<DashboardStatsData>> {
    const { user, period = "30" } = arg;

    // Calculate date range
    const daysAgo = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    try {
      // Validate user ID
      if (!user.id) {
        throw new Error("User ID tidak ditemukan");
      }

      // Get author ID from user
      const authUser = await db.auth_user.findFirst({
        where: { id: user.id },
        include: { author: true },
      });

      if (!authUser) throw new Error("User tidak ditemukan");

      if (!authUser.author)
        throw new Error("Author tidak ditemukan untuk user ini");

      const authorId = authUser.author.id;

      // Get overall statistics for this author
      const totalBooks = await db.book.count({
        where: {
          id_author: authorId,
          deleted_at: null,
        },
      });

      const totalProducts = await db.product.count({
        where: {
          id_author: authorId,
        },
      });

      const totalSales = await db.t_sales_line.aggregate({
        where: {
          product: {
            id_author: authorId,
          },
          t_sales: {
            status: BadgeStatus.PAID,
            created_at: {
              gte: startDate,
            },
          },
        },
        _sum: {
          total_price: true,
          qty: true,
        },
        _count: {
          id: true,
        },
      });

      const recentSales = await db.t_sales_line.findMany({
        where: {
          product: {
            id_author: authorId,
          },
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
                select: {
                  id: true,
                  name: true,
                },
              },
              author: {
                select: {
                  id: true,
                  name: true,
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
      });

      const topBooks = await db.$queryRaw`
        SELECT 
          b.id,
          b.name,
          a.name as author_name,
          COUNT(tsl.id) as total_sales,
          COALESCE(SUM(tsl.total_price), 0) as total_revenue,
          COALESCE(SUM(tsl.qty), 0) as total_quantity
        FROM book b
        JOIN author a ON b.id_author = a.id
        JOIN product p ON b.id_product = p.id
        LEFT JOIN t_sales_line tsl ON p.id = tsl.id_product
        LEFT JOIN t_sales ts ON tsl.id_sales = ts.id
        WHERE b.deleted_at IS NULL 
          AND b.id_author = ${authorId}::uuid
          AND (ts.status = ${BadgeStatus.PAID} OR ts.status IS NULL)
          AND (ts.created_at >= ${startDate} OR ts.created_at IS NULL)
        GROUP BY b.id, b.name, a.name
        ORDER BY total_revenue DESC
        LIMIT 10
      `;

      const salesByMonth = await db.$queryRaw`
        SELECT 
          DATE_TRUNC('month', ts.created_at) as month,
          COUNT(tsl.id) as sales_count,
          COALESCE(SUM(tsl.total_price), 0) as total_revenue
        FROM t_sales_line tsl
        JOIN t_sales ts ON tsl.id_sales = ts.id
        JOIN product p ON tsl.id_product = p.id
        WHERE ts.status = ${BadgeStatus.PAID}
          AND p.id_author = ${authorId}::uuid
          AND ts.created_at >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', ts.created_at)
        ORDER BY month DESC
      `;

      // Convert BigInt values to numbers for JSON serialization
      const convertBigIntToNumber = (obj: any): any => {
        if (typeof obj === "bigint") {
          return Number(obj);
        }
        if (Array.isArray(obj)) {
          return obj.map(convertBigIntToNumber);
        }
        if (obj && typeof obj === "object") {
          const converted: any = {};
          for (const key in obj) {
            converted[key] = convertBigIntToNumber(obj[key]);
          }
          return converted;
        }
        return obj;
      };

      return {
        success: true,
        data: {
          overview: {
            total_books: totalBooks,
            total_products: totalProducts,
            total_sales_count: totalSales._count.id || 0,
            total_sales_revenue: Number(totalSales._sum.total_price) || 0,
            total_quantity_sold: Number(totalSales._sum.qty) || 0,
            period_days: daysAgo,
          },
          recent_sales: convertBigIntToNumber(recentSales),
          top_books: convertBigIntToNumber(topBooks),
          sales_by_month: convertBigIntToNumber(salesByMonth),
        },
      };
    } catch (error) {
      console.error("Dashboard stats error:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        userId: user.id,
        period: period,
        startDate: startDate.toISOString(),
      });

      // Always show detailed error for debugging
      throw new Error(
        `Dashboard stats error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
});
