import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "browse",
  url: "/browse/:page",
  async handler() {
    const req = this.req!;
    const page = req.params?.page ? parseInt(req.params.page) : 1;
    const books_per_page = 20;
    const skip_books = page > 1 ? (page - 1) * books_per_page : 0;

    const products = await db.product.findMany({
      select: {
        name: true,
        slug: true,
        currency: true,
        real_price: true,
        strike_price: true,
        cover: true,
        is_chapter: true,
      },
      where: {
        status: "published",
        deleted_at: null,
      },
      orderBy: {
        published_date: "desc",
      },
      skip: skip_books,
      take: books_per_page,
    });

    const total_pages = Math.ceil(
      (await db.product.count({
        where: {
          status: "published",
          deleted_at: null,
        },
      })) / books_per_page
    );

    const data = {
      title: ``,
      products: products,
      page: page,
      pages: total_pages,
    };

    const seo_data = {
      slug: `/browse${page > 1 ? `/${page}` : ``}`,
      page: page,
      meta_title: ``,
      meta_description: ``,
      image: ``,
      headings: ``,
      paragraph: ``,
      is_product: false,
    };

    return {
      jsx: (
        <>
          <SeoTemplate data={seo_data} />
        </>
      ),
      data: data,
    };
  },
});
