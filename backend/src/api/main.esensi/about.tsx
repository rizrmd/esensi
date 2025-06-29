import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "about",
  url: "/about",
  async handler() {

    const req = this.req!;

    const logo = {
      img: `data:image/png;base64,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`,
      alt: `Esensi Online`,
    };

    const content = `<h3>Empowering Your Talent</h3><p>Di PT Meraih Ilmu Semesta, kami percaya bahwa setiap orang memiliki potensi luar biasa untuk berbagi ilmu dan inspirasi melalui tulisan.</p>
<p>Kami hadir untuk membantu para penulis, pemikir, dan profesional dalam mewujudkan ide-ide mereka menjadi karya digital yang dapat dinikmati oleh pembaca di seluruh dunia.</p>
<p>Sebagai perusahaan yang bergerak di bidang penerbitan digital, kami menawarkan solusi lengkap bagi penulis.</p>`;

const links = [
      {
        label: "Email kami",
        sublabel: "info@esensi.online",
        url: "mailto:info@esensi.online",
        newTab: true,
        icon: "mail",
      },
      /*
      {
        label: "Telepon kami",
        sublabel: `(031) 000 000
          Jam Operasional 08:00 - 20:00 WIB`,
        url: "#",
        newTab: true,
        icon: "phone",
      },
      {
        label: "Customer support",
        url: "#",
        newTab: true,
        icon: "chat",
      },
      {
        label: "Pusat bantuan",
        url: "#",
        newTab: true,
        icon: "file",
      },
      */
    ];

    const data = {
      title: `Tentang Kami`,
      logo: logo,
      content: content,
      links: links,
      breadcrumb: [{
        url: null,
        label: "About",
      }],
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
