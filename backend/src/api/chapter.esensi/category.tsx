import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "category",
  url: "/category/:slug/:page",
  async handler() {
    const req = this.req!;
    const page = req.params?.page ? parseInt(req.params.page) : 1;
    const books_per_page = 20;
    const skip_books = page > 1 ? ((page - 1) * books_per_page) : 0;

    const cat_slug = req?.params.slug ? req.params.slug : ``;

    const cat = await db.category.findFirst({
      where: {
        slug: cat_slug,
        deleted_at: null
      },
      include: {
        product_category: true
      },
    });

    const books = await db.product.findMany({
      where: {
        id: {
          in: cat?.product_category?.map(
            (x) => x.id_product
          )
        },
        status: "published",
        is_chapter: true,
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
            in: cat?.product_category?.map(
              (x) => x.id_product
            )
          },
          status: "published", deleted_at: null
        },
      }) / books_per_page);

    const data = {
      title: `Ebook tentang ${cat?.name}`,
      products: books,
      page: page,
      pages: total_pages,
    }

    const seo_data = {
      slug: `/category/${req.params?.slug ? `${req.params.slug}` : ``}${page > 1 ? `/${page}` : ``}`,
      page: page,
      meta_title: `Chapter Web Novel ${cat?.name} Terbaik | Koleksi Cerita ${cat?.name} di Esensi Online`,
      meta_description: `Temukan koleksi web novel ${cat?.name} di Esensi Online. Baca cerita ${cat?.name} yang seru, gratis, dan selalu update!`,
      image: ``,
      headings: `Chapter Web Novel ${cat?.name} di Esensi Online`,
      h2: `Rekomendasi Cerita ${cat?.name} Terbaik`,
      h3: `Update Terbaru di Kategori ${cat?.name}`,
      h4: `Jelajahi Cerita ${cat?.name} Lainnya di Esensi Online`,
      paragraph: `Kategori ${cat?.name} di Esensi Online menghadirkan cerita-cerita pilihan dengan tema ${cat?.name}. Cocok untuk kamu yang suka ${cat?.name}. Temukan web novel favoritmu di sini dan nikmati bacaan berkualitas setiap hari!`,
      is_product: false,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
