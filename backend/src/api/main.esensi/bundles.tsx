import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";
import { ProductStatus } from "../../lib/types";

export default defineAPI({
  name: "bundles",
  url: "/bundles/:page",
  async handler() {
    const req = this.req!;

    const page = req.params?.page ? parseInt(req.params.page) : 1;
    const books_per_page = 20;
    const skip_books = page > 1 ? (page - 1) * books_per_page : 0;

    const products = await db.bundle.findMany({
      where: {
        status: ProductStatus.PUBLISHED,
        deleted_at: null,
      },
      skip: skip_books,
      take: books_per_page,
      include: {
        bundle_product: {
          select: {
            product: {
              select: {
                name: true,
                slug: true,
                cover: true,
                strike_price: true,
                real_price: true,
                currency: true,
                product_file: true,
              },
            },
          },
          where: {
            product: {
              status: ProductStatus.PUBLISHED,
              deleted_at: null,
            },
          },
        },
      },
    });

    const total_pages = Math.ceil(
      (await db.bundle.count({
        where: {
          status: ProductStatus.PUBLISHED,
          deleted_at: null,
        },
      })) / books_per_page
    );

    const data = {
      title: `Lihat Semua Bundle`,
      list: products,
      page: page,
      total_pages: total_pages,
    };

    const seo_data = {
      slug: `/bundles${page > 1 ? `/${page}` : ``}`,
      page: page,
      meta_title: `Bundle ebook hemat | Paket spesial lebih lengkap lebih murah`,
      meta_description: `Beli bundle eBook lebih hemat! Temukan pilihan eBook terbaik dalam satu paket dengan harga lebih terjangkau.`,
      image: ``,
      headings: `Bundle ebook hemat | Paket spesial lebih lengkap lebih murah`,
      paragraph: `Beli bundle eBook lebih hemat! Temukan pilihan eBook terbaik dalam satu paket dengan harga lebih terjangkau.`,
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
