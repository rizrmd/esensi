import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "customer_get",
  url: "/api/internal/customer/get",
  async handler(arg: {
    id: string;
    include_user?: boolean;
    include_account?: boolean;
    include_sales?: boolean;
    include_track?: boolean;
    include_reader?: boolean;
  }) {
    const {
      id,
      include_user = false,
      include_account = false,
      include_sales = false,
      include_track = false,
      include_reader = false,
    } = arg;

    if (!id?.trim()) throw new Error("ID customer wajib diisi");

    const include = {
      ...(include_user && { auth_user: true }),
      ...(include_account && { auth_account: true }),
      ...(include_sales && { t_sales: true }),
      ...(include_track && { customer_track: true }),
      ...(include_reader && { customer_reader: true }),
    };

    const customer = await db.customer.findUnique({
      where: { id },
      include,
    });

    if (!customer) throw new Error("Customer tidak ditemukan");

    return customer;
  },
});
