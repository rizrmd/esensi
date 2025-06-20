import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";
import { ProductStatus } from "../../lib/types";

export default defineAPI({
  name: "product",
  url: "/product/:slug",
  async handler() {
    const req = this.req!;
    console.log("slug:", req.params.slug);

    // if slug == "_" redirect to /browse

    const product = await db.product.findFirst({
      where: {
        slug: req.params.slug,
        status: ProductStatus.PUBLISHED,
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
    });

    const author = await db.author.findFirst({
      select: {
        name: true,
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
      product: product,
      categories: categories,
      author: author,
      owned: false,
      bookmarked: false,
      in_cart: false,
      related: [],
    };

    const seo_data = {
      slug: `/product/${req.params.slug}`,
      meta_title: `${product?.name} oleh ${product?.info} | Unduh Ebook Sekarang`,
      meta_description: `eBook ${product?.name} dengan tema ${cats}. Dapatkan sinopsis, preview, dan link unduh legal dengan aman, murah, dan terpercaya hanya di sini!`,
      image: `${product?.cover}`,
      headings: `${product?.name}`,
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
