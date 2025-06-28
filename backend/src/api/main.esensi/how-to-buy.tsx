import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "howtobuy",
  url: "/how-to-buy",
  async handler() {

    const req = this.req!;

    const content = ``;


    const data = {
      title: `Cara Pembelian`,
      content: content,
      breadcrumb: [{
        url: null,
        label: "Cara Pembelian",
      }],
    };

    const seo_data = {
      slug: `/how-to-buy`,
      meta_title: ``,
      image: ``,
      headings: ``,
      paragraph: ``,
      is_product: false,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
