import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "search",
  url: "/search/:slug/:page",
  async handler() {
    const req = this.req!;

    const keyword = req.params?.slug ? decodeURI(req.params.slug) : "";

    const page = req.params?.page ? parseInt(req.params.page) : 1;
    const books_per_page = 20;
    const skip_books = req.params?.page ? ((page - 1) * books_per_page) : 0;

    const products_search = await db.product.findMany({
      select: {
        name: true,
        real_price: true,
        strike_price: true,
        slug: true,
        currency: true,
        cover: true,
      },
      where: {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
        is_chapter: true,
        status: "published",
      },
      skip: skip_books,
      take: books_per_page,
      orderBy: {
        published_date: "desc",
      },
    });

    const bundles_search = await db.bundle.findMany({
      select: {
        name: true,
        real_price: true,
        strike_price: true,
        slug: true,
        currency: true,
        cover: true,
        bundle_product: {
          select: {
            product: {
              select: {
                id: true,
                cover: true,
              },
            },
          },
        },
      },
      where: {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
        status: "published",
      },
    });

    const products = [
      ...products_search.map((e) => ({
        ...e, type: "product"
      })),
      ...bundles_search.map((e) => ({
        ...e, type: "bundle"
      })),
    ];

    const count_products = await db.product.count({
      where: {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
        status: "published",
      },
    });

    const count_bundles = await db.bundle.count({
      where: {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
        status: "published",
      },
    });

    const count_both = count_products + count_bundles;
    const total_pages = Math.ceil( count_both / books_per_page );

    const data = {
      title: `Hasil Pencarian`,
      products: products,
      page: page,
      pages: total_pages,
    }

    const seo_data = {
      slug: `/search${req.params?.slug ? `/${req.params.slug}` : `/_`}${page > 1 ? `/${page}` : ``}`,
      page: page,
      meta_title: `Hasil Pencarian untuk ebook ${keyword}`,
      meta_description: `Temukan eBook tentang ${keyword}. Temukan bacaan berkualitas, update terbaru, dan pilihan eBook digital terbaik Indonesia.`,
      image: ``,
      headings: `Hasil Pencarian untuk ebook ${keyword}`,
      paragraph: `Temukan eBook tentang ${keyword}. Temukan bacaan berkualitas, update terbaru, dan pilihan eBook digital terbaik Indonesia.`,
      is_product: false,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
