import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "bundle_detail",
  url: "/api/publish/bundle/:id",
  async handler(arg: { id: string; author_id: string }) {
    const bundle = await db.bundle.findFirst({
      where: { 
        id: arg.id,
        bundle_product: {
          some: {
            product: {
              id_author: arg.author_id
            }
          }
        },
        deleted_at: null
      },
      select: {
        id: true,
        name: true,
        slug: true,
        desc: true,
        real_price: true,
        strike_price: true,
        currency: true,
        status: true,
        cover: true,
        img_file: true,
        info: true,
        sku: true,
        // Note: cfg is intentionally excluded for authors
        bundle_product: {
          select: {
            id: true,
            qty: true,
            product: {
              select: {
                id: true,
                name: true,
                real_price: true,
                currency: true,
                cover: true
              }
            }
          }
        }
      }
    });

    if (!bundle) {
      throw new Error("Bundle tidak ditemukan atau Anda tidak memiliki akses");
    }

    return bundle;
  },
});
