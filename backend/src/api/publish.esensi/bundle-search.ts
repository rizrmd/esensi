import type { User } from "backend/lib/better-auth";
import type { BundleSearchResponse } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "bundle_search",
  url: "/api/publish/bundle/search",
  async handler(arg: {
    user: Partial<User>;
    query?: string;
    status?: string[];
    price_min?: number;
    price_max?: number;
    has_products?: boolean;
    has_categories?: boolean;
    category_ids?: string[];
    product_ids?: string[];
    sort_by?: "name" | "price" | "created_at" | "sales";
    sort_order?: "asc" | "desc";
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<BundleSearchResponse>> {
    try {
      const {
        query,
        status,
        price_min,
        price_max,
        has_products,
        has_categories,
        category_ids,
        product_ids,
        sort_by = "name",
        sort_order = "asc",
        page = 1,
        limit = 10,
      } = arg;

      const skip = (page - 1) * limit;
      const where: any = { deleted_at: null };

      // Text search
      if (query?.trim()) {
        where.OR = [
          { name: { contains: query.trim(), mode: "insensitive" } },
          { slug: { contains: query.trim(), mode: "insensitive" } },
          { desc: { contains: query.trim(), mode: "insensitive" } },
          { sku: { contains: query.trim(), mode: "insensitive" } },
        ];
      }

      // Status filter
      if (status && status.length > 0) {
        where.status = { in: status };
      }

      // Price filter
      if (price_min !== undefined || price_max !== undefined) {
        where.real_price = {};
        if (price_min !== undefined) {
          where.real_price.gte = price_min;
        }
        if (price_max !== undefined) {
          where.real_price.lte = price_max;
        }
      }

      // Content filters
      if (has_products === true) {
        where.bundle_product = { some: {} };
      } else if (has_products === false) {
        where.bundle_product = { none: {} };
      }

      if (has_categories === true) {
        where.bundle_category = { some: {} };
      } else if (has_categories === false) {
        where.bundle_category = { none: {} };
      }

      // Category filter
      if (category_ids && category_ids.length > 0) {
        where.bundle_category = {
          some: {
            id_category: { in: category_ids },
          },
        };
      }

      // Product filter
      if (product_ids && product_ids.length > 0) {
        where.bundle_product = {
          some: {
            id_product: { in: product_ids },
          },
        };
      }

      // Build orderBy
      let orderBy: any = {};

      switch (sort_by) {
        case "name":
          orderBy = { name: sort_order };
          break;
        case "price":
          orderBy = { real_price: sort_order };
          break;
        case "created_at":
          // Bundle doesn't have created_at, use name as fallback
          orderBy = { name: sort_order };
          break;
        case "sales":
          // Sort by sales count (requires aggregation)
          orderBy = { t_sales_line: { _count: sort_order } };
          break;
        default:
          orderBy = { name: sort_order };
      }

      const [bundles, total] = await Promise.all([
        db.bundle.findMany({
          where,
          include: {
            bundle_category: {
              include: {
                category: true,
              },
            },
            bundle_product: {
              include: {
                product: {
                  include: {
                    author: true,
                  },
                },
              },
            },
            _count: {
              select: {
                t_sales_line: true,
              },
            },
          },
          orderBy,
          take: limit,
          skip,
        }),
        db.bundle.count({ where }),
      ]);

      // Add calculated fields
      const enrichedBundles = bundles.map((bundle) => ({
        ...bundle,
        product_count: bundle.bundle_product.length,
        category_count: bundle.bundle_category.length,
        sales_count: bundle._count.t_sales_line,
        total_products_qty: bundle.bundle_product.reduce(
          (sum, bp) => sum + (bp.qty || 0),
          0
        ),
      }));

      return {
        success: true,
        data: {
          bundles: enrichedBundles,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
          filters: {
            query,
            status,
            price_range: {
              min: price_min,
              max: price_max,
            },
            has_products,
            has_categories,
            category_ids,
            product_ids,
          },
          sort: {
            sort_by,
            sort_order,
          },
        },
        message: "Pencarian bundle berhasil",
      };
    } catch (error) {
      console.error("Error in bundle search API:", error);
      return {
        success: false,
        message: "Terjadi kesalahan dalam pencarian bundle",
        data: {
          bundles: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
          filters: { price_range: {} },
          sort: {}
        },
      };
    }
  },
});
