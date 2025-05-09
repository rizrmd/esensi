import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "cart",
  url: "/cart",
  async handler() {
    const req = this.req!;

    //const uid = this?.session?.user.id;
    const uid = ``;

    const data = {
      title: `Keranjang Belanja`,
      content: {},
    };

    const seo_data = {
      slug: `/cart`,
      meta_title: `Keranjang Belanja | Cek & Lanjutkan Pembelian Ebook Digitalmu`,
      meta_description: `Lihat item yang telah Anda pilih di keranjang belanja. Lanjutkan ke pembayaran dan dapatkan segera akses download dan baca ebook.`,
      image: ``,
      headings: `Keranjang Belanja | Cek & Lanjutkan Pembelian Ebook Digitalmu`,
      paragraph: `Lihat item yang telah Anda pilih di keranjang belanja. Lanjutkan ke pembayaran dan dapatkan segera akses download dan baca ebook.`,
      is_product: false,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
