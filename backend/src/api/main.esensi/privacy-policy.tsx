import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "privacypolicy",
  url: "/privacy-policy",
  async handler() {

    const req = this.req!;

    const content = ``;


    const data = {
      title: `Kebijakan Privasi`,
      content: content,
      breadcrumb: [{
        url: null,
        label: "Kebijakan Privasi",
      }],
    };

    const seo_data = {
      slug: `/privacypolicy`,
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
