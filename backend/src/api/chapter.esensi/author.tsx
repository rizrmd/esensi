import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "author",
  url: "/author/:username/:page",
  async handler() {
    const req = this.req!;
    const page = req.params?.page ? parseInt(req.params.page) : 1;
    const books_per_page = 20;
    const skip_books = page > 1 ? ((page - 1) * books_per_page) : 0;

    const user_data = await db.auth_user.findFirst({
      where: {
        username: req.params.username,
      },
      select: {
        id: true,
        name: true,
        username: true,
        id_author: true,
      },
    });

    const author_data = await db.author.findFirst({
      where: {
        id: user_data?.id_author ?? undefined,
      },
      select: {
        id: true,
        name: true,
      },
    });

    const author_books = await db.book.findMany({
      where: {
        id_author: user_data?.id_author ?? undefined,
        deleted_at: null,
        status: "published",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        cover: true,
        currency: true,
        real_price: true,
        strike_price: true,
      },
      orderBy: {
        published_date: "desc",
      },
      take: books_per_page,
      skip: skip_books,
    });

    const data = {
      title: ``,
      content: ``,
    };

    const seo_data = {
      slug: `/author/${req.params.username}${page > 1 ? `/${page}` : ``}`,
      page: page,
      meta_title: `Karya Web Novel oleh ${author_data?.name} | Esensi Online`,
      meta_description: `Jelajahi koleksi web novel karya ${author_data?.name} di Esensi Online. Baca cerita-cerita pilihan dengan gaya penulisan unik dan alur yang memikat.`,
      image: ``,
      headings: `Karya ${author_data?.name} di Esensi Online`,
      h2: `Web Novel Terpopuler oleh ${author_data?.name}`,
      h3: `Update Terbaru dari ${author_data?.name}`,
      h4: `Penulis Lain yang Mungkin Kamu Suka`,
      paragraph: `${author_data?.name} adalah penulis berbakat di Esensi Online yang dikenal dengan gaya menulis [ciri khas atau genre]. Di halaman ini, kamu bisa menemukan semua web novel karya mereka—mulai dari rilisan terbaru hingga cerita paling populer. Dukung penulis favoritmu dan nikmati karya-karyanya secara gratis!`,
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
