import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "store",
  url: "/api/store",
  async handler() {
    const req = this.req!;
    console.log("route: " + "/api/store");
    
    // Get all books
    const allbooks = await db.product.findMany({
      where: {
        deleted_at: null,
        status: "active"
      },
      include: {
        author: true,
        product_category: {
          include: {
            category: true
          }
        }
      }
    });

    // Get all categories
    const categories = await db.category.findMany({
      where: {
        deleted_at: null
      }
    });

    return {
      allbooks,
      categories
    };
  },
});
