import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "author",
  url: "/author/:username",
  async handler() {

    const req = this.req!;

    const data = {
      title: ``,
      content: ``,
    };

    const seo_data = {
      slug: `/author/${req.params.username}`,
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
