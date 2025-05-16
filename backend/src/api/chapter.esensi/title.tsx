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

    const product = await db.product.findFirst({
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
    };

    const seo_data = {
      slug: `/title/${req.params.slug}`,
      meta_title: `${product?.name} - Chapter Web Novel oleh ${product?.info} | Esensi Online`,
      meta_description: `Baca ${product?.name} karya ${product?.info} di Esensi Online. Cerita ${cats} dengan alur yang menarik dan karakter yang kuat. Update secara berkala & gratis dibaca!`,
      image: `${product?.cover}`,
      headings: `${product?.name} oleh ${product?.info}`,
      paragraph: `${product?.desc}`,
      keywords: `${cats}`,
      is_product: true,
      price: product?.real_price,
      currencry: product?.currency,
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
