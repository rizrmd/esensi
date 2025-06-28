import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "tos",
  url: "/tos",
  async handler() {

    const req = this.req!;

    const content = ``;


    const data = {
      title: `Syarat dan Ketentuan Pengguna`,
      content: content,
      breadcrumb: [{
        url: null,
        label: "Terms of Service",
      }],
    };

    const seo_data = {
      slug: `/tos`,
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
