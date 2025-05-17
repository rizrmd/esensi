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
      meta_title: `Baca Chapter Web Novel Terbaru dan Terpopuler | Esensi Online - Katalog Cerita Indonesia`,
      meta_description: `Esensi Online menyajikan ribuan web novel terbaru dan terpopuler dari berbagai genre seperti fantasi, romantis, aksi, dan lainnya. Baca cerita online gratis dan update setiap hari!`,
      image: ``,
      headings: `Chapter Web Novel Terlengkap dan Terupdate di Esensi Online`,
      h2: `Genre Favorit Pembaca di Esensi Online`,
      h3: `Rilisan Web Novel Terbaru Hari Ini`,
      h4: `Cerita Paling Populer di Esensi Online Minggu Ini`,
      h5: `Bergabung di Esensi Online dan Mulai Membaca Sekarang`,
      paragraph: `Selamat datang di Esensi Online, rumah bagi ratusan web novel menarik dari penulis lokal dan internasional. Temukan cerita favoritmu dari genre seperti fantasi, romantis, aksi, horor, hingga slice of life. Esensi Online memperbarui koleksi ceritanya setiap hari dan bisa diakses secara gratis. Nikmati pengalaman membaca yang seru dan imajinatif bersama kami!`,
      keywords: ``,
      is_product: false,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
