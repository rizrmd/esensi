import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "customer_list",
  url: "/api/internal/customer/list",
  async handler(arg: {
    search?: string;
    limit?: number;
    offset?: number;
    include_user?: boolean;
    include_account?: boolean;
    include_sales?: boolean;
    include_track?: boolean;
    include_reader?: boolean;
  }) {
    const {
      search,
      limit = 50,
      offset = 0,
      include_user = false,
      include_account = false,
      include_sales = false,
      include_track = false,
      include_reader = false,
    } = arg;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { whatsapp: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const include = {
      ...(include_user && { auth_user: true }),
      ...(include_account && { auth_account: true }),
      ...(include_sales && { t_sales: true }),
      ...(include_track && { customer_track: true }),
      ...(include_reader && { customer_reader: true }),
    };

    const [data, total] = await Promise.all([
      db.customer.findMany({
        where,
        include,
        take: limit,
        skip: offset,
        orderBy: { name: "asc" },
      }),
      db.customer.count({ where }),
    ]);

    return {
      data,
      total,
      limit,
      offset,
    };
  },
});
