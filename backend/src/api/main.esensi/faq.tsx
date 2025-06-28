import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "faq",
  url: "/faq",
  async handler() {
    const req = this.req!;

    const content = ``;

    const list = [
      {
        q: `Apa itu Esensi Online?`,
        a: `Esensi Online merupakan sebuah platform yang membantu mempublikasikan karya tulis kamu secara digital sebagai ebook.`,
      },
      {
        q: `Apakah saya dapat menulis buku saya sendiri di Esensi Online?`,
        a: `Ya, tentu saja bisa.`,
      },
      {
        q: `Ke mana saya bisa menghubungi Esensi Online untuk informasi yang lebih lanjut?`,
        a: `Kamu dapat menghubungi kami melalui email info@esensi.online`,
      },
      
    ];

    const data = {
      title: `Pertanyaan Yang Sering Diajukan`,
      content: content,
      list: list,
      breadcrumb: [
        {
          url: null,
          label: "FAQs",
        },
      ],
    };

    const seo_data = {
      slug: `/faq`,
      meta_title: ``,
      image: ``,
      headings: ``,
      paragraph: ``,
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
