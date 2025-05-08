import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "trx",
  url: "/trx/:id",
  async handler() {

    const req = this.req!;
    const uid = ""; // Replace with user id

    const trx = await db.t_sales.findFirst({
      where: {
        id_customer: uid,
        id: req.params.id,
      },
      include: {
        t_sales_line: true,
      },
    });

    const data = {
      title: `Detail Pembelian`,
      trx: trx,
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
