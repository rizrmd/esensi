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
      meta_title: `Hasil Pencarian untuk Judul dan Chapter "[Kata Kunci]" | Esensi Online`,
      meta_description: `Lihat hasil pencarian untuk "[Kata Kunci]" di Esensi Online. Temukan cerita menarik berdasarkan judul, genre, atau tag yang cocok dengan preferensimu`,
      image: ``,
      headings: `Hasil Pencarian untuk Judul dan Chapter "[Kata Kunci]" | Esensi Online`,
      h2: `Hasil Pencarian untuk “[Kata Kunci]” di Esensi Online`,
      h3: `Web Novel yang Cocok dengan Pencarianmu`,
      h4: `Rekomendasi Cerita Lainnya yang Mungkin Kamu Suka`,
      paragraph: `Berikut adalah hasil pencarian untuk judul buku atau judul chapter “[Kata Kunci]” di Esensi Online. Daftar ini mencakup cerita-cerita yang paling relevan dengan pencarianmu. Coba ubah kata kunci atau filter hasil untuk menemukan cerita favoritmu.`,
      is_product: false,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
