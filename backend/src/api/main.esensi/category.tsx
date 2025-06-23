import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";
import { ProductStatus } from "../../lib/types";

export default defineAPI({
  name: "category",
  url: "/category/:slug/:page",
  async handler() {
    const req = this.req!;
    const page = req.params?.page ? parseInt(req.params.page) : 1;
    const books_per_page = 20;
    const skip_books = page > 1 ? (page - 1) * books_per_page : 0;

    const cat_slug = req?.params.slug ? req.params.slug : ``;

    const cat = await db.category.findFirst({
      where: {
        slug: cat_slug,
        deleted_at: null,
      },
      include: {
        product_category: true,
      },
    });

    const products = await db.product.findMany({
      where: {
        id: {
          in: cat?.product_category?.map((x) => x.id_product),
        },
        status: ProductStatus.PUBLISHED,
        deleted_at: null,
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
      (await db.product.count({
        where: {
          id: {
            in: cat?.product_category?.map((x) => x.id_product),
          },
          status: ProductStatus.PUBLISHED,
          deleted_at: null,
        },
      })) / books_per_page,
    );

    const data = {
      title: `Semua Ebook tentang ${cat?.name}`,
      list: products,
      pagination: {
        items: books_per_page,
        page: page,
        total_pages: total_pages,
        url: {
          prefix: `/category/${req.params?.slug}`,
          suffix: "",
        },
      },
      breadcrumb: [{
        url: null,
        label: `${cat?.name}${page > 1 ? ` (page ${page})` : "" }`,
      }],
    };

    const seo_data = {
      slug: `/category/${req.params?.slug ? `${req.params.slug}` : ``}${
        page > 1 ? `/${page}` : ``
      }`,
      page: page,
      meta_title: `Ebook ${cat?.name} Terbaik | Unduh dan baca Ebook ${cat?.name}`,
      meta_description: `Lihat koleksi eBook kategori ${cat?.name}. Temukan bacaan berkualitas, update terbaru, dan pilihan eBook digital terbaik Indonesia.`,
      image: ``,
      headings: `Ebook ${cat?.name} Terbaik | Unduh dan baca Ebook ${cat?.name}`,
      paragraph: `Lihat koleksi eBook kategori ${cat?.name}. Temukan bacaan berkualitas, update terbaru, dan pilihan eBook digital terbaik Indonesia.`,
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
