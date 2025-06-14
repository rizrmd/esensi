import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";
import { ProductStatus } from "../../lib/types";

export default defineAPI({
  name: "index",
  url: "/",
  async handler(arg: {
    allbooks_cat: string | null;
    limit: number | null;
    bundling_slug: string | null;
  }) {
    const req = this.req!;

    let allbooks_where, bundle_where;
    let bundling = [] as any;

    const books_limit = arg?.limit !== null ? arg?.limit : 12;

    if (arg?.allbooks_cat !== "" && arg?.allbooks_cat !== null) {
      const cat = await db.category.findFirst({
        where: {
          slug: arg?.allbooks_cat,
          deleted_at: null,
        },
        include: {
          product_category: true,
        },
      });

      allbooks_where = {
        deleted_at: null,
        status: "published",
        id: {
          in: cat?.product_category?.map((x) => x.id_product),
        },
      };
    } else {
      allbooks_where = {
        deleted_at: null,
        status: "published",
      };
    }

    const allbooks = await db.product.findMany({
      select: {
        name: true,
        real_price: true,
        strike_price: true,
        currency: true,
        cover: true,
        slug: true,
      },
      where: allbooks_where,
      take: books_limit,
      orderBy: {
        published_date: "desc",
      },
    });

    // Get all categories
    const categories = await db.category.findMany({
      select: {
        name: true,
        slug: true,
        img: true,
      },
      where: {
        id_parent: null,
        deleted_at: null,
      },
    });

    /*
    if (arg?.bundling_slug !== "" && arg?.bundling_slug !== null) {

      const the_bundle = await db.bundle.findFirst({
        where: {
          slug: arg?.bundling_slug,
          deleted_at: null,
        },
        include:{
          bundle_product: true,
        },
      });

      bundling = await db.product.findMany({
        select: {
          name: true,
          real_price: true,
          strike_price: true,
          currency: true,
          cover: true,
          slug: true,
          id_author: true,
        },
        where: {
          deleted_at: null,
          status: "published",
          id: {
            in: the_bundle?.bundle_product?.map((x) => x.id_product),
          },
        },
      });
    }
      */
    bundling = allbooks.slice(0, 4);

    const featured = await db.product.findMany({
      select: {
        name: true,
        real_price: true,
        strike_price: true,
        currency: true,
        cover: true,
        slug: true,
      },
      where: {
        deleted_at: null,
        status: "published",
      },
      take: 10,
      orderBy: {
        published_date: "desc",
      },
    });

    const data = {
      title: `Esensi Online`,
      categories: categories,
      allbooks: allbooks,
      featured: featured,
      bundling: {
        slug: arg?.bundling_slug,
        img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi8LDs1PB_FuxsL-EUHP99aM4unr41aIFRdoO_FolO4GpD3f4VkSADO39hoVe5QsiBZuk-gkTfceeu43MyLbzXwKOte07e1MkaQfoKn7h4rK4v0zAcjRLIzQzs7dByjOzu9ZsnYT-hz6_XoqE0-jgZHlJa7_MhgOkccmaEsS9dRueTueshO1zQu-xV7kSk/s1600/bundle-desktop.png",
        list: bundling,
      },
    };

    const seo_data = {
      slug: `/store`,
      meta_title: `Belanja Ebook Online | Temukan Ribuan Judul Ebook | Esensi Online`,
      meta_description: `Jelajahi koleksi eBook terbaik Indonesia. Temukan bacaan favorit Anda dan beli eBook berkualitas dengan harga terjangkau hanya di toko kami.`,
      image: ``,
      headings: `Belanja Ebook Online | Temukan Ribuan Judul Ebook | Esensi Online`,
      paragraph: `Jelajahi koleksi eBook terbaik Indonesia. Temukan bacaan favorit Anda dan beli eBook berkualitas dengan harga terjangkau hanya di toko kami.`,
      keywords: `toko buku,ebook`,
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
