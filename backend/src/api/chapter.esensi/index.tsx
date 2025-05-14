import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "index",
  url: "/",
  async handler() {

    const req = this.req!;

    const data = {
      title: `Esensi Chapter`,
      content: {},
    };

    const seo_data = {
      slug: `/`,
      meta_title: ``,
      meta_description: ``,
      image: ``,
      headings: ``,
      paragraph: ``,
      keywords: ``,
      is_product: false,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
