import { SeoTemplate } from "backend/components/SeoTemplate";
import { kebabCase } from "lodash";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "chapter",
  url: "/chapter/:slug/:number",
  async handler() {
    const req = this.req!;
    console.log("slug:", req.params.slug);

    // if slug == "_" redirect to /browse

    const product = await db.product.findFirst(
      {
        where: {
          slug: req.params.slug,
          status: "published",
          is_chapter: true,
          deleted_at: null,
        },
        include: {
          product_category: {
            select: {
              category: {
                select: { name: true, slug: true },
              },
            },
            where: {
              category: {
                deleted_at: null,
              },
            },
          },
        },
      },
    );

    let cats = "";
    product?.product_category.map((cat) => {
      cats = cats + ", " + cat.category.name;
    });

    const categories = product?.product_category.map((cat) => {
      return {
        name: cat.category.name,
        slug: cat.category.slug,
      };
    });

    const data = {
      title: `Detail Ebook`,
      product: product,
      categories: categories,
    }


    const seo_data = {
      slug: `/chapter/${req.params.slug}/${req.params.number}`,
      meta_title: `[Judul Buku] Chapter [Nomor Bab] - [Judul Bab] | Esensi Online`,
      meta_description: `Baca Bab [Nomor Bab] “[Judul Bab]” dari “[Judul Buku]” karya [Nama Penulis] di Esensi Online. [Deskripsi singkat isi atau suasana bab]. Update terbaru, gratis dibaca`,
      image: `${product?.cover}`,
      headings: `[Judul Buku] - Chapter [Nomor chapt]: [Judul chapter]`,
      paragraph: `Chapter [Nomor Bab] dari “[Judul Buku]” adalah kelanjutan kisah yang [deskripsi suasana bab: mendebarkan / menyentuh / mengejutkan]. Nikmati kisah ini secara gratis dan eksklusif di Esensi Online—update rutin dari penulis [Nama Penulis].`,
      keywords: `${cats}`,
      is_product: true,
      price: product?.real_price,
      currencry: product?.currency,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
