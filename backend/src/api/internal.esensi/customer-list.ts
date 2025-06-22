import type { Customer } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "customer_list",
  url: "/api/internal/customer/list",
  async handler(arg: {
    page?: number;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Customer[]>> {
    const page = arg.page || 1;
    const limit = arg.limit || 10;
    const skip = (page - 1) * limit;

    const where = arg.search
      ? {
          OR: [
            { name: { contains: arg.search, mode: "insensitive" as const } },
            { email: { contains: arg.search, mode: "insensitive" as const } },
            { whatsapp: { contains: arg.search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      db.customer.findMany({
        where,
        include: {
          auth_user: true,
          auth_account: true,
          t_sales: true,
          customer_track: true,
          customer_reader: true,
        },
        take: limit,
        skip,
        orderBy: { name: "asc" },
      }),
      db.customer.count({ where }),
    ]);

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
});
