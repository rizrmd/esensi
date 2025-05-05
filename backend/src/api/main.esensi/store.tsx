import { defineAPI, html } from "rlib/server";

export default defineAPI({
  name: "store",
  url: "/store",
  async handler() {
    const req = this.req!;
    console.log("route: " + "/api/store");

    // Get all books
    const allbooks = await db.product.findMany({
      select: {
        name: true,
        real_price: true,
        strike_price: true,
        currency: true,
        cover: true,
        slug: true,
      },
      where: {
        deleted_at: null,
        status: "published",
      },
      take: 12,
      orderBy: {
        published_date: "desc",
      },
    });

    // Get all categories
    const categories = await db.category.findMany({
      where: {
        deleted_at: null,
      },
    });

    return html(
      <>
        <head>
          <title>{}</title>
        </head>
        <body>
          <>an si</>
        </body>
      </>
    );
  },
});
