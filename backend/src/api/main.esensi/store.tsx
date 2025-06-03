import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";
import { ProductStatus } from "../types";

export default defineAPI({
  name: "store",
  url: "/store",
  async handler() {
    const req = this.req!;
    const allbooks = await db.product.findMany({
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
        status: ProductStatus.PUBLISHED,
      },
      take: 12,
      orderBy: {
        published_date: "desc",
      },
    });

    // Get all categories
    const categories = await db.category.findMany({
      where: {
        deleted_at: null,
      },
    });

    const data = {
      title: `Esensi Online`,
      categories: categories,
      allbooks: allbooks,
      content: {},
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
