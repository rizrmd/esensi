import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";
import { ProductStatus } from "../../lib/types";

export default defineAPI({
  name: "bundle",
  url: "/bundle/:slug",
  async handler() {
    const req = this.req!;
    const product = await db.bundle.findFirst({
      where: { slug: req.params.slug },
      include: {
        bundle_product: {
          select: {
            product: {
              select: {
                name: true,
                slug: true,
                cover: true,
                strike_price: true,
                real_price: true,
                currency: true,
                product_file: true,
              },
            },
          },
          where: {
            product: {
              status: ProductStatus.PUBLISHED,
              deleted_at: null,
            },
          },
        },
      },
    });

    const qty = product?.bundle_product.length;

    const data = {
      title: `Detil Bundle`,
      product: product,
    };

    const seo_data = {
      slug: `/bundle/${req.params.slug}`,
      meta_title: `${product?.name} | Paket bundle Ebook lebih hemat sekaligus`,
      meta_description: `Beli ${qty} ebook lebih hemat dengan bundle ${product?.name}. Dapatkan koleksi lebih lengkap dengan harga spesial.`,
      image: `${product?.cover}`,
      headings: `${product?.name}`,
      paragraph: `${product?.desc}`,
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
