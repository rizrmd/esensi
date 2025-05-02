import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "all",
  url: "/api/all",
  async handler() {
    const req = this.req!;
    const data = await db.product.findMany({
      select: {
        name: true,
        slug: true,
        currency: true,
        real_price: true,
        strike_price: true,
        cover: true,
      },
      where: {
        status: "published",
        deleted_at: null,
      },
      orderBy: {
        published_date: "desc",
      },
    });

    return {
      data,
    };
  },
});
