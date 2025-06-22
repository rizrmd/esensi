import type { Customer } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "customer_create",
  url: "/api/internal/customer/create",
  async handler(arg: {
    name: string;
    email: string;
    whatsapp: string;
    id_account?: string;
    id_user?: string;
    otp?: number;
  }): Promise<ApiResponse<Customer>> {
    const { name, email, whatsapp, id_account, id_user, otp } = arg;

    // Validate required fields
    if (!name?.trim()) throw new Error("Nama customer wajib diisi");

    if (!email?.trim()) throw new Error("Email customer wajib diisi");

    if (!whatsapp?.trim()) throw new Error("WhatsApp customer wajib diisi");

    // Check if customer with same email already exists
    const existingEmail = await db.customer.findFirst({
      where: { email: email.trim(), deleted_at: null },
    });

    if (existingEmail)
      throw new Error("Customer dengan email tersebut sudah ada");

    // Check if customer with same whatsapp already exists
    const existingWhatsapp = await db.customer.findFirst({
      where: { whatsapp: whatsapp.trim(), deleted_at: null },
    });

    if (existingWhatsapp)
      throw new Error("Customer dengan WhatsApp tersebut sudah ada");

    const result = await db.customer.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        id_account: id_account || null,
        id_user: id_user || null,
        otp: otp || null,
      },
      include: {
        auth_user: true,
        auth_account: true,
        t_sales: true,
        customer_track: true,
        customer_reader: true,
      },
    });

    return {
      success: true,
      data: result,
      message: "Customer berhasil ditambahkan",
    };
  },
});
