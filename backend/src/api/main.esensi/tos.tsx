import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "tos",
  url: "/tos",
  async handler() {

    const req = this.req!;

    const content = ``;


    const data = {
      title: `Syarat dan Ketentuan Pengguna`,
      content: content,
      breadcrumb: [{
        url: null,
        label: "Terms of Service",
      }],
    };

    const seo_data = {
      slug: `/tos`,
      meta_title: `Syarat dan Ketentuan Layanan | Esensi Online - Ketentuan Penggunaan Platform`,
      meta_description: `Baca Syarat dan Ketentuan Esensi Online untuk memahami aturan penggunaan platform, hak dan kewajiban pengguna, serta kebijakan terkait pembelian dan penerbitan ebook.`,
      image: ``,
      headings: `Syarat dan Ketentuan Layanan`,
      paragraph: `Halaman ini memuat Syarat dan Ketentuan yang mengatur penggunaan layanan di Esensi Online, baik sebagai pembeli maupun penulis. Dengan mengakses atau menggunakan platform kami, Anda dianggap telah menyetujui seluruh kebijakan, termasuk penggunaan akun, pembelian ebook, serta hak dan tanggung jawab terkait penerbitan digital.`,
      is_product: false,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
