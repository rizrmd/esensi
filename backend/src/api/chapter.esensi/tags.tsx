import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "tags",
  url: "/tags/:slug/:page",
  async handler() {
    const req = this.req!;
    const page = req.params?.page ? parseInt(req.params.page) : 1;
    const books_per_page = 20;
    const skip_books = page > 1 ? ((page - 1) * books_per_page) : 0;

    const tag_slug = req?.params.slug ? req.params.slug : ``;

    const tag = await db.category.findFirst({
      where: {
        slug: tag_slug,
        deleted_at: null
      },
      include: {
        product_category: true
      },
    });

    const products = await db.product.findMany({
      where: {
        id: {
          in: tag?.product_category?.map(
            (x) => x.id_product
          )
        },
        is_chapter: true,
        status: "published",
        deleted_at: null
      },
      select: {
        id: true,
        cover: true,
        desc: true,
        currency: true,
        name: true,
        real_price: true,
        strike_price: true,
        slug: true,
      },
      skip: skip_books,
      take: books_per_page,
      orderBy: {
        published_date: "desc",
      },
    });


    const total_pages = Math.ceil(
      await db.product.count({
        where: {
          id: {
            in: tag?.product_category?.map(
              (x) => x.id_product
            )
          },
          status: "published", deleted_at: null
        },
      }) / books_per_page);

    const data = {
      title: `Ebook tentang ${tag?.name}`,
      products: products,
      page: page,
      pages: total_pages,
    }

    const seo_data = {
      slug: `/tags/${req.params?.slug ? `${req.params.slug}` : ``}${page > 1 ? `/${page}` : ``}`,
      page: page,
      meta_title: `Web Novel Tag ${tag?.name} | Koleksi Cerita ${tag?.name} di Esensi Online`,
      meta_description: `Temukan cerita-cerita dengan tag ${tag?.name} di Esensi Online. Baca web novel bertema ${tag?.name} yang seru, update, dan bisa diakses kapan saja!`,
      image: ``,
      headings: `Web Novel dengan Tag ${tag?.name} di Esensi Online`,
      h2: `Koleksi Cerita ${tag?.name} Terpopuler`,
      h3: `Update Terbaru untuk Tag ${tag?.name}`,
      h4: `Jelajahi ${tag?.name} Lainnya di Esensi Online`,
      paragraph: `Tag ${tag?.name} di Esensi Online mengumpulkan cerita-cerita bertema ${tag?.name}. Temukan berbagai judul seru dan unik yang bisa kamu baca kapan saja. Koleksi ini selalu diperbarui untuk menghadirkan bacaan terbaik bagi para pecinta genre ini.`,
      is_product: false,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
