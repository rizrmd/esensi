import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "index",
  url: "/",
  async handler() {
    const req = this.req!;

    const books_lastest = await db.book.findMany({
      select: {
        name: true,
        slug: true,
        submitted_price: true,
        currency: true,
        desc: true,
      },
      where: {
        deleted_at: null,
        status: "published",
      },
      orderBy: {
        published_date: "desc",
      },
      take: 20,
      skip: 0,
    });

    const genre = await db.genre.findMany({
      select: {
        name: true,
        slug: true,
      },
      where: {
        deleted_at: null,
      },
    });

    const tags = await db.tags.findMany({
      select: {
        name: true,
        slug: true,
        img: true,
      },
      where: {
        deleted_at: null,
        id_parent: null,
      },
    });

    const data = {
      title: `Esensi Chapter`,
      books: books_lastest,
      genre: genre,
      tags: tags,
      content: {},
    };

    const seo_data = {
      slug: `/`,
      meta_title: `Baca Chapter Web Novel Terbaru dan Terpopuler | Esensi Online - Katalog Cerita Indonesia`,
      meta_description: `Esensi Online menyajikan ribuan web novel terbaru dan terpopuler dari berbagai genre seperti fantasi, romantis, aksi, dan lainnya. Baca cerita online gratis dan update setiap hari!`,
      image: ``,
      headings: `Chapter Web Novel Terlengkap dan Terupdate di Esensi Online`,
      h2: `Genre Favorit Pembaca di Esensi Online`,
      h3: `Rilisan Web Novel Terbaru Hari Ini`,
      h4: `Cerita Paling Populer di Esensi Online Minggu Ini`,
      h5: `Bergabung di Esensi Online dan Mulai Membaca Sekarang`,
      paragraph: `Selamat datang di Esensi Online, rumah bagi ratusan web novel menarik dari penulis lokal dan internasional. Temukan cerita favoritmu dari genre seperti fantasi, romantis, aksi, horor, hingga slice of life. Esensi Online memperbarui koleksi ceritanya setiap hari dan bisa diakses secara gratis. Nikmati pengalaman membaca yang seru dan imajinatif bersama kami!`,
      keywords: ``,
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
