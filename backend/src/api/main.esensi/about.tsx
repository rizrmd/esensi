import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "about",
  url: "/about",
  async handler() {

    const req = this.req!;

    const data = {
      title: `Tentang Kami`,
      content: {},
    };

    const seo_data = {
      slug: `/about`,
      meta_title: `Tentang Kami | Penyedia Ebook Terpercaya dan Berkualitas`,
      meta_description: `Informasi tentang kami (Esensi Online) dan bagaimana kami menghadirkan eBook digital terbaik untuk Anda. Komitmen kami adalah memberikan layanan terpercaya dan koleksi eBook berkualitas.`,
      image: ``,
      headings: `Tentang Kami | Penyedia Ebook Terpercaya dan Berkualitas`,
      paragraph: `Informasi tentang kami (Esensi Online) dan bagaimana kami menghadirkan eBook digital terbaik untuk Anda. Komitmen kami adalah memberikan layanan terpercaya dan koleksi eBook berkualitas.`,
      is_product: false,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
