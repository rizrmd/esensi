import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "rankings",
  url: "/rankings",
  async handler() {

    const req = this.req!;

    const data = {
      title: ``,
      content: ``,
    };

    const seo_data = {
      slug: `/rankings`,
      meta_title: ``,
      meta_description: ``,
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
