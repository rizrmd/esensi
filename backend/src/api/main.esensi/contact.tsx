import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "contact",
  url: "/contact",
  async handler() {

    const req = this.req!;

    const data = {
      title: `Hubungi Kami`,
      content: {},
    };


    const seo_data = {
      slug: `/contact`,
      meta_title: `Hubungi Kami | Bantuan & Dukungan Pelanggan`,
      meta_description: `Ada pertanyaan atau butuh bantuan seputar pembelian atau unduhan eBook? Tim kami siap membantu Anda.`,
      image: ``,
      headings: `Hubungi Kami | Bantuan & Dukungan Pelanggan`,
      paragraph: `Ada pertanyaan atau butuh bantuan seputar pembelian atau unduhan eBook? Tim kami siap membantu Anda.`,
      is_product: false,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
