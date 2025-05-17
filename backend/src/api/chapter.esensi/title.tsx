import { SeoTemplate } from "backend/components/SeoTemplate";
import { kebabCase } from "lodash";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "title",
  url: "/title/:slug",
  async handler() {
    const req = this.req!;
    console.log("slug:", req.params.slug);

    // if slug == "_" redirect to /browse

    const book = await db.product.findFirst({
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
              select: {
                name: true,
                slug: true
              },
            },
          },
          where: {
            category: {
              deleted_at: null,
            },
          },
        },
      },
    });

    let cats = "";
    book?.product_category.map((cat) => {
      cats = cats + ", " + cat.category.name;
    });

    const categories = book?.product_category.map((cat) => {
      return {
        name: cat.category.name,
        slug: cat.category.slug,
      };
    });

    const data = {
      title: `Detail Ebook`,
      product: book,
      categories: categories,
    };

    const seo_data = {
      slug: `/title/${req.params.slug}`,
      meta_title: `${book?.name} - Chapter Web Novel oleh ${book?.info} | Esensi Online`,
      meta_description: `Baca ${book?.name} karya ${book?.info} di Esensi Online. Cerita ${cats} dengan alur yang menarik dan karakter yang kuat. Update secara berkala & gratis dibaca!`,
      image: `${book?.cover}`,
      headings: `${book?.name} oleh ${book?.info}`,
      paragraph: `${book?.desc}`,
      keywords: `${cats}`,
      is_product: true,
      price: book?.real_price,
      currencry: book?.currency,
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
