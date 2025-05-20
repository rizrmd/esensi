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

    const book = await db.book.findFirst({
      where: {
        slug: req.params.slug,
        status: "published",
        is_chapter: true,
        deleted_at: null,
      },
    });

    let cats = ``;

    const author = await db.auth_user.findFirst({
      select: {
        name: true,
        username: true,
        display_username: true,
        image: true,
      },
      where: {
        id_author: book?.id_author,
      },
    });

    const chapters = await db.chapter.findMany({
      where: {
        id_product: book?.id,
      },
      orderBy: {
        number: `asc`,
      },
    });

    const ratings = await db.reviews.aggregate({
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
      where: {
        id_book: book?.id,
        deleted_at: null,
        parent: null,
      },
    });

    const reviews = await db.reviews.findMany({
      where: {
        id_book: book?.id,
        deleted_at: null,
      },
    });

    const data = {
      title: `Detail Ebook`,
      book: book,
      author: author,
      ratings: ratings,
      reviews: reviews,
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
      price: book?.submitted_price,
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
