import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "about",
  url: "/about",
  async handler() {

    const req = this.req!;

    const logo = {
      img: `_file/upload/esensi-online-logo.png`,
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
