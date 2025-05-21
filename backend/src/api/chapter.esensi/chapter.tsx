import { SeoTemplate } from "backend/components/SeoTemplate";
import { kebabCase } from "lodash";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "chapter",
  url: "/chapter/:title/:number/:slug",
  async handler() {
    const req = this.req!;
    console.log("slug:", req.params.slug);

    // if slug == "_" redirect to /browse

    const book = await db.book.findFirst({
      select: {
        id: true,
        name: true,
        id_product: true,
        id_author: true,
      },
      where: {
        slug: req.params.title,
        status: "published",
        is_chapter: true,
        deleted_at: null,
      },
    });

    const product = await db.product.findFirst({
      where: {
        id: book?.id_product != null ? book.id_product : undefined,
        deleted_at: null,
      },
    });

    const chapter_number = parseInt(req.params.number);
    const chapter = await db.chapter.findFirst({
      where: {
        id_product: book?.id_product != null ? book.id_product : undefined,
        number: chapter_number,
      },
    });

    const author = await db.author.findFirst({
      where: {
        id: book?.id_author != null ? book.id_author : undefined,
      },
    });

    const genres = await db.book_genre.findMany({
      where: {
        id_book: book?.id,
      },
      include: {
        genre: {
          select: {
            name: true,
            slug: true,
            deleted_at: true,
          },
        },
      },
    });

    let the_genres = "";
    genres.map((g) => {
      if (g.genre.deleted_at != null) {
        the_genres = the_genres + `, ${g.genre}`;
      }
    });

    let cek_active_genres = [] as any;
    genres.map((g) => {
      if (g.genre.deleted_at != null) {
        cek_active_genres.push(g.genre);
      }
    });

    const active_genres = cek_active_genres;

    const data = {
      title: `Detail Ebook`,
      book: book,
      product: product,
      chapter: chapter,
      genres: active_genres,
    };

    const seo_data = {
      slug: `/chapter/${req.params.slug}/${req.params.number}`,
      meta_title: `${book?.name} Chapter ${req.params.number} - ${chapter?.name} | Esensi Online`,
      meta_description: `Baca Bab ${req.params.number} ${chapter?.name} dari ${book?.name} karya [Nama Penulis] di Esensi Online. [Deskripsi singkat isi atau suasana bab]. Update terbaru, gratis dibaca`,
      image: `${product?.cover}`,
      headings: `${book?.name} - Chapter ${req.params.number}: ${chapter?.name}`,
      paragraph: `Chapter ${req.params.number} dari ${book?.name} adalah kelanjutan kisah yang [deskripsi suasana bab: mendebarkan / menyentuh / mengejutkan]. Nikmati kisah ini secara gratis dan eksklusif di Esensi Online—update rutin dari penulis [Nama Penulis].`,
      keywords: `${the_genres}`,
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
