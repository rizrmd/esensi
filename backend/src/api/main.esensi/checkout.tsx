import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "checkout",
  url: "/checkout",
  async handler() {
    
    const req = this.req!;

    const data = {
      title: `Lanjutkan pembayaran`,
      content: {},
    };
    
    const seo_data = {
      slug: `/checkout`,
      meta_title: `Checkout | Selesaikan Pembelian Ebook Digitalmu dengan Aman`,
      meta_description: `Lakukan pembayaran dengan mudah di halaman checkout ini. Selesaikan pembelian eBook Anda dalam beberapa langkah.`,
      image: ``,
      headings: `Checkout | Selesaikan Pembelian Ebook Digitalmu dengan Aman`,
      paragraph: `Lakukan pembayaran dengan mudah di halaman checkout ini. Selesaikan pembelian eBook Anda dalam beberapa langkah.`,
      is_product: false,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
