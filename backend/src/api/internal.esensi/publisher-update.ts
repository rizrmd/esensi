import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "publisher_update",
  url: "/api/internal/publisher/update",
  async handler(arg: {
    id: string;
    name?: string;
    description?: string;
    website?: string;
    address?: string;
    logo?: string;
    id_account?: string;
    id_user?: string;
  }) {
    const {
      id,
      name,
      description,
      website,
      address,
      logo,
      id_account,
      id_user,
    } = arg;

    if (!id?.trim()) {
      throw new Error("ID publisher wajib diisi");
    }

    // Check if publisher exists
    const existing = await db.publisher.findUnique({
      where: { id },
    });

    if (!existing) throw new Error("Publisher tidak ditemukan");

    // If name is being updated, check for duplicates
    if (name && name.trim() !== existing.name) {
      const nameExists = await db.publisher.findFirst({
        where: { name: name.trim(), id: { not: id } },
      });

      if (nameExists)
        throw new Error("Publisher dengan nama tersebut sudah ada");
    }

    // Build update data object
    const updateData: any = {};

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined)
      updateData.description = description?.trim() || null;
    if (website !== undefined) updateData.website = website?.trim() || null;
    if (address !== undefined) updateData.address = address?.trim() || null;
    if (logo !== undefined) updateData.logo = logo?.trim() || null;
    if (id_account !== undefined) updateData.id_account = id_account || null;
    if (id_user !== undefined) updateData.id_user = id_user || null;

    const result = await db.publisher.update({
      where: { id },
      data: updateData,
      include: {
        auth_user: true,
        auth_account: true,
        publisher_author: { include: { author: true } },
      },
    });

    return result;
  },
});
