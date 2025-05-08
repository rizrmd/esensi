import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "profile",
  url: "/profile",
  async handler() {

    const req = this.req!;

    const uid = ``;

    const user = await db.customer.findFirst({
      where: {
        id: uid,
      },
    });

    const data = {
      title: `Informasi Profil`,
      content: {},
    };

    const seo_data = {
      slug: `/profile`,
      meta_title: `Profil Saya | Kelola Akun dan Informasi Pembelian Ebook`,
      meta_description: `Kelola profil Anda, ubah informasi akun dengan mudah di halaman ini.`,
      image: ``,
      headings: `Profil Saya | Kelola Akun dan Informasi Pembelian Ebook`,
      paragraph: `Kelola profil Anda, ubah informasi akun dengan mudah di halaman ini.`,
      is_product: false,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
