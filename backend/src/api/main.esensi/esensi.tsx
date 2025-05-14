import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "esensi",
  url: "/esensi",
  async handler() {

    const req = this.req!;

    const data = {
      title: `Navigasi Esensi`,
      content: {},
    };

    const seo_data = {
      slug: `/esensi`,
      meta_title: `Navigasi Halaman Esensi Online`,
      meta_description: `Akses link penting untuk memudahkan navigasi di situs kami.`,
      image: ``,
      headings: `Navigasi Halaman Esensi Online`,
      paragraph: `Akses link penting untuk memudahkan navigasi di situs kami.`,
      is_product: false,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
