import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "trx",
  url: "/trx/:id",
  async handler() {

    const req = this.req!;

    //const uid = this?.session?.user.id;
    const uid = ``;

    let data = {
      title: `Login Untuk Lihat Detail Pembelian`,
      userid: null,
      trx: null as any,
    }

    if (uid) {
      const trx = await db.t_sales.findFirst({
        where: {
          id_customer: uid,
          id: req.params.id,
        },
        include: {
          t_sales_line: true,
        },
      });

      data.userid = uid;
      data.trx = trx;
    }

    const seo_data = {
      slug: `/trx/${req.params.id}`,
      meta_title: `Detail Pembelian Ebook Anda | ID Transaksi [ID]`,
      meta_description: `Cek detail dari pembelian ebook anda.`,
      image: ``,
      headings: `Detail Pembelian Ebook Anda | ID Transaksi [ID]`,
      paragraph: `Cek detail dari pembelian ebook anda.`,
      is_product: false,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
