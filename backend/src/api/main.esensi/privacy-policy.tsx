import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "privacypolicy",
  url: "/privacy-policy",
  async handler() {
    const req = this.req!;

    const content = ``;

    const data = {
      title: `Kebijakan Privasi`,
      content: content,
      breadcrumb: [
        {
          url: null,
          label: "Kebijakan Privasi",
        },
      ],
    };

    const seo_data = {
      slug: `/privacypolicy`,
      meta_title: `Kebijakan Privasi | Esensi Online - Perlindungan Data Pengguna`,
      meta_description: `Baca Kebijakan Privasi Esensi Online untuk mengetahui bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda saat menggunakan layanan marketplace dan penerbitan ebook kami.`,
      image: ``,
      headings: `Kebijakan Privasi`,
      h1: `Kebijakan Privasi`,
      h2: `Komitmen Kami terhadap Privasi Anda`,
      h3: `Informasi yang Kami Kumpulkan`,
      h4: `Cara Penggunaan Data Pribadi`,
      h5: `Perlindungan & Keamanan Data`,
      h6: `Hak Pengguna dan Pembaruan Kebijakan`,
      paragraph: `Esensi Online berkomitmen untuk menjaga privasi pengguna kami. Melalui halaman Kebijakan Privasi ini, kami menjelaskan cara pengumpulan, penggunaan, dan perlindungan informasi pribadi saat Anda menjelajahi atau melakukan transaksi ebook di platform kami. Dengan menggunakan layanan Esensi Online, Anda menyetujui praktik pengelolaan data yang kami terapkan.`,
      is_product: false,
    };

    return {
      jsx: (
        <>
          <SeoTemplate data={seo_data} />
        </>
      ),
      data: data,
    };
  },
});
