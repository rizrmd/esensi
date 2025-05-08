import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "history",
  url: "/history/:page",

  async handler() {
    const req = this.req!;
    const page = req.params?.page ? parseInt(req.params.page) : 1;
    const books_per_page = 20;
    const skip_books = req.params?.page ? ((page - 1) * books_per_page) : 0;

    const uid = "";

    const trxs = await db.t_sales.findMany({
      where: {
        id_customer: uid,
        status: "paid",
      },
      include: {
        t_sales_line: true,
      },
      skip: skip_books,
      take: books_per_page,
      orderBy: {
        created_at: "desc",
      },
    });

    const total_pages = Math.ceil(
      await db.t_sales.count({
        where: {
          id_customer: uid,
          status: "paid",
        },
      }) / books_per_page
    );

    const data = {
      title: `Riwayat Pembelian`,
      products: trxs,
      page: page,
      pages: total_pages,
    }

    const seo_data = {
      slug: `/history${page > 1 ? `/${page}` : ``}`,
      page: page,
      meta_title: `Riwayat Pembelian Ebook | Cek Semua Transaksi Anda`,
      meta_description: `Semua pembelian eBook kamu tercatat rapi di sini. Cek kembali transaksi lama, lihat detailnya, dan unduh ulang eBook favoritmu kapan saja.`,
      image: ``,
      headings: `Riwayat Pembelian Ebook | Cek Semua Transaksi Anda`,
      paragraph: `Semua pembelian eBook kamu tercatat rapi di sini. Cek kembali transaksi lama, lihat detailnya, dan unduh ulang eBook favoritmu kapan saja.`,
      is_product: false,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
