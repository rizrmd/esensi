import type { Customer } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
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
  }): Promise<ApiResponse<Customer>> {
    const { id } = arg;

    if (!id?.trim()) throw new Error("ID customer wajib diisi");

    const customer = await db.customer.findUnique({
      where: { id },
      include: {
        auth_user: true,
        auth_account: true,
        t_sales: true,
        customer_track: true,
        customer_reader: true,
      },
    });

    if (!customer) throw new Error("Customer tidak ditemukan");
    return {
      success: true,
      data: customer,
      message: "Customer berhasil ditambahkan",
    };
  },
});
