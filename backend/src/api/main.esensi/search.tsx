import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";
import { ProductStatus } from "../../lib/types";

export default defineAPI({
  name: "search",
  url: "/search/:slug/:page",
  async handler() {
    const req = this.req!;

    const keyword = req.params?.slug ? decodeURI(req.params.slug) : "";

    const page = req.params?.page ? parseInt(req.params.page) : 1;
    const books_per_page = 20;
    const skip_books = req.params?.page ? (page - 1) * books_per_page : 0;

    const products_search = await db.product.findMany({
      select: {
        name: true,
        real_price: true,
        strike_price: true,
        slug: true,
        currency: true,
        cover: true,
      },
      where: {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
        status: ProductStatus.PUBLISHED,
      },
      skip: skip_books,
      take: books_per_page,
      orderBy: {
        published_date: "desc",
      },
    });

    const bundles_search = await db.bundle.findMany({
      select: {
        name: true,
        real_price: true,
        strike_price: true,
        slug: true,
        currency: true,
        cover: true,
        bundle_product: {
          select: {
            product: {
              select: {
                id: true,
                cover: true,
              },
            },
          },
        },
      },
      where: {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
        status: ProductStatus.PUBLISHED,
      },
    });

    const products = [
      ...products_search.map((e) => ({
        ...e,
        type: "product",
      })),
      ...bundles_search.map((e) => ({
        ...e,
        type: "bundle",
      })),
    ];

    const count_products = await db.product.count({
      where: {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
        status: ProductStatus.PUBLISHED,
      },
    });

    const count_bundles = await db.bundle.count({
      where: {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
        status: ProductStatus.PUBLISHED,
      },
    });

    const count_both = count_products + count_bundles;
    const total_pages = Math.ceil(count_both / books_per_page);


    let categories = null;
    let trending = null;

    if(!req.params?.slug){
      categories = await db.category.findMany({
        select:{
          name: true,
          slug: true,
        },
        where: {
          deleted_at: null,
        },
      });
    }


    const data = {
      title: `Hasil pencarian buku dengan kata kunci ${keyword}`,
      list: products,
      pagination: {
        items: books_per_page,
        page: page,
        total_pages: total_pages,
        url: {
          prefix: `/search/${req.params?.slug}`,
          suffix: "",
        },
      },
      categories: categories,
      trending: trending,
    };

    const seo_data = {
      slug: `/search${req.params?.slug ? `/${req.params.slug}` : `/_`}${
        page > 1 ? `/${page}` : ``
      }`,
      page: page,
      meta_title: `Hasil Pencarian untuk ebook ${keyword}`,
      meta_description: `Temukan eBook tentang ${keyword}. Temukan bacaan berkualitas, update terbaru, dan pilihan eBook digital terbaik Indonesia.`,
      image: ``,
      headings: `Hasil Pencarian untuk ebook ${keyword}`,
      paragraph: `Temukan eBook tentang ${keyword}. Temukan bacaan berkualitas, update terbaru, dan pilihan eBook digital terbaik Indonesia.`,
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
