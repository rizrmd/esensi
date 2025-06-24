import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "history",
  url: "/history/:status/:page",

  async handler() {
    const req = this.req!;
    const page = req.params?.page ? parseInt(req.params.page) : 1;
    const books_per_page = 20;
    const skip_books = req.params?.page ? (page - 1) * books_per_page : 0;

    //const uid = this?.session?.user.id;
    const uid = `ffebfc51-bf4d-46d9-acad-994454d3f83c`; // For testing purposes, replace with actual user ID retrieval logic


    const statuses = [
      "pending",
      "paid",
      "canceled",
      "fraud",
      "expired",
      "refunded",
    ];
    const trxs_where =
      req.params?.status &&
      req.params.status !== "all" &&
      statuses.includes(req.params.status)
        ? {
            id_customer: uid,
            status: req.params.status,
          }
        : {
            id_customer: uid,
          };

    const total_pages = 1;

    let data = {
      title: `Riwayat Pembelian`,
      userid: null as any | null,
      list: [] as any,
      pagination: {
        items: books_per_page,
        page: page,
        total_pages: total_pages,
        url: {
          prefix: "/history",
          suffix: "",
        },
      },
      breadcrumb: [
        {
          url: null,
          label: `Riwayat Transaksi`,
        },
      ],
    };

    if (uid) {
      const trxs = await db.t_sales.findMany({
        where: trxs_where,
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
        (await db.t_sales.count({
          where: trxs_where,
        })) / books_per_page
      );

      data.userid = uid;
      data.list = trxs;
    }

    const seo_data = {
      slug: `/history/${
        req.params?.status && statuses.includes(req.params.status)
          ? req.params.status
          : `_`
      }${page > 1 ? `/${page}` : ``}`,
      page: page,
      meta_title: `Riwayat Pembelian Ebook | Cek Semua Transaksi Anda`,
      meta_description: `Semua pembelian eBook kamu tercatat rapi di sini. Cek kembali transaksi lama, lihat detailnya, dan unduh ulang eBook favoritmu kapan saja.`,
      image: ``,
      headings: `Riwayat Pembelian Ebook | Cek Semua Transaksi Anda`,
      paragraph: `Semua pembelian eBook kamu tercatat rapi di sini. Cek kembali transaksi lama, lihat detailnya, dan unduh ulang eBook favoritmu kapan saja.`,
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
