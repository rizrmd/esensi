import type { CustomerUpdateResponse } from "backend/lib/types";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "customer_update",
  url: "/api/internal/customer/update",
  async handler(arg: {
    id: string;
    name?: string;
    email?: string;
    whatsapp?: string;
    id_account?: string;
    id_user?: string;
    otp?: number;
  }): Promise<ApiResponse<CustomerUpdateResponse>> {
    const { id, name, email, whatsapp, id_account, id_user, otp } = arg;

    if (!id?.trim()) throw new Error("ID customer wajib diisi");

    // Check if customer exists
    const existing = await db.customer.findUnique({ where: { id } });

    if (!existing) throw new Error("Customer tidak ditemukan");

    // If email is being updated, check for duplicates
    if (email && email.trim() !== existing.email) {
      const emailExists = await db.customer.findFirst({
        where: {
          email: email.trim(),
          id: { not: id },
          deleted_at: null,
        },
      });

      if (emailExists)
        throw new Error("Customer dengan email tersebut sudah ada");
    }

    // If whatsapp is being updated, check for duplicates
    if (whatsapp && whatsapp.trim() !== existing.whatsapp) {
      const whatsappExists = await db.customer.findFirst({
        where: {
          whatsapp: whatsapp.trim(),
          id: { not: id },
          deleted_at: null,
        },
      });

      if (whatsappExists)
        throw new Error("Customer dengan WhatsApp tersebut sudah ada");
    }

    // Build update data object
    const updateData: any = {};

    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.trim();
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp.trim();
    if (id_account !== undefined) updateData.id_account = id_account || null;
    if (id_user !== undefined) updateData.id_user = id_user || null;
    if (otp !== undefined) updateData.otp = otp;

    const result = await db.customer.update({
      where: { id },
      data: updateData,
      include: { auth_user: true, auth_account: true },
    });

    return {
      success: true,
      data: result,
    };
  },
});
