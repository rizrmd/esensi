import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "publisher_create",
  url: "/api/internal/publisher/create",
  async handler(arg: {
    name: string;
    description?: string;
    website?: string;
    address?: string;
    logo?: string;
    id_account?: string;
    id_user?: string;
  }) {
    const { name, description, website, address, logo, id_account, id_user } =
      arg;

    // Validate required fields
    if (!name?.trim()) {
      throw new Error("Nama publisher wajib diisi");
    }

    // Check if publisher with same name already exists
    const existing = await db.publisher.findFirst({
      where: { name: name.trim() },
    });

    if (existing) throw new Error("Publisher dengan nama tersebut sudah ada");

    const result = await db.publisher.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        website: website?.trim() || null,
        address: address?.trim() || null,
        logo: logo?.trim() || null,
        id_account: id_account || null,
        id_user: id_user || null,
      },
      include: {
        auth_user: true,
        auth_account: true,
        publisher_author: { include: { author: true } },
      },
    });

    return result;
  },
});
