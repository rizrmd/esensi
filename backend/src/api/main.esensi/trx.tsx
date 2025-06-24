import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "trx",
  url: "/trx/:id",
  async handler() {
    const req = this.req!;

    //const uid = this?.session?.user.id;
    const uid = `df942d45-c358-4981-8d17-5974fe9c15a8`; // For testing purposes, replace with actual user ID retrieval logic

    let data = {
      title: `Login Untuk Lihat Detail Pembelian`,
      userid: null as any | null,
      trx: null as any,
      breadcrumb: [] as any,
    };

    if (uid) {
      const trx = await db.t_sales.findFirst({
        where: {
          // id_customer: uid,
          id: req.params.id,
          deleted_at: null,
        },
        include: {
          t_sales_line: true,
        },
      });

      data.userid = uid;
      data.trx = trx;
      data.breadcrumb = [
        {
          url: "/history/all",
          label: `Semua Transaksi`,
        },
        {
          url: null,
          label: trx?.id,
        },
      ];
    }

    const seo_data = {
      slug: `/trx/${req.params.id}`,
      meta_title: `Detil Pembelian Ebook Anda | ID Transaksi [ID]`,
      meta_description: `Cek detail dari pembelian ebook anda.`,
      image: ``,
      headings: `Detil Pembelian Ebook Anda | ID Transaksi [ID]`,
      paragraph: `Cek detail dari pembelian ebook anda.`,
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
