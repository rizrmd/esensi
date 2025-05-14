import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "library",
  url: "/library",
  async handler() {

    const req = this.req!;

    //const uid = this?.session?.user.id;
    const uid = ``;

    let data = {
      title: `Koleksi Ebook Milikmu`,
      content: {} as Record<
        string,
        { id: string; percent: number; last_page: number }
      >
    };

    if (uid) {

    }

    const seo_data = {
      slug: `/library`,
      meta_title: `Koleksi Ebook Milikmu | Akses Mudah dan Baca Kapan Saja`,
      meta_description: `Semua eBook yang telah Anda beli tercatat di sini. Segera nikmati akses baca langsung dari akun anda.`,
      image: ``,
      headings: `Koleksi Ebook Milikmu | Akses Mudah dan Baca Kapan Saja`,
      paragraph: `Semua eBook yang telah Anda beli tercatat di sini. Segera nikmati akses baca langsung dari akun anda.`,
      is_product: false,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
