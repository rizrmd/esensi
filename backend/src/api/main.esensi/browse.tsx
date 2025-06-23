import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";
import { ProductStatus } from "../../lib/types";

export default defineAPI({
  name: "browse",
  url: "/browse/:page",
  async handler() {
    const req = this.req!;
    const page = req.params?.page ? parseInt(req.params.page) : 1;
    const books_per_page = 10;
    const skip_books = page > 1 ? (page - 1) * books_per_page : 0;

    const products = await db.product.findMany({
      select: {
        name: true,
        slug: true,
        currency: true,
        real_price: true,
        strike_price: true,
        cover: true,
      },
      where: {
        status: ProductStatus.PUBLISHED,
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
          status: ProductStatus.PUBLISHED,
          deleted_at: null,
        },
      })) / books_per_page,
    );

    const data = {
      title: `Lihat Semua Ebook`,
      list: products,
      pagination: {
        items: books_per_page,
        page: page,
        total_pages: total_pages,
        url: {
          prefix: "/browse",
          suffix: "",
        },
      },
    };

    const seo_data = {
      slug: `/browse${page > 1 ? `/${page}` : ``}`,
      page: page,
      meta_title: `Temukan Ribuan Judul Ebook Terbaik Indonesia | Esensi Online`,
      meta_description: `Lihat semua koleksi eBook terbaik Indonesia. Temukan bacaan favorit Anda dan beli eBook berkualitas dengan harga terjangkau hanya di toko kami.`,
      image: ``,
      headings: `Temukan Ribuan Judul Ebook Terbaik Indonesia | Esensi Online`,
      paragraph: `Lihat semua koleksi eBook terbaik Indonesia. Temukan bacaan favorit Anda dan beli eBook berkualitas dengan harga terjangkau hanya di toko kami.`,
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
