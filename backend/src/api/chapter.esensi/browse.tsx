import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";
import { BookStatus } from "../types";

export default defineAPI({
  name: "browse",
  url: "/browse/:page",
  async handler() {
    const req = this.req!;
    const page = req.params?.page ? parseInt(req.params.page) : 1;
    const books_per_page = 20;
    const skip_books = page > 1 ? (page - 1) * books_per_page : 0;

    const books = await db.book.findMany({
      select: {
        name: true,
        slug: true,
        currency: true,
        submitted_price: true,
        cover: true,
      },
      where: {
        status: BookStatus.PUBLISHED,
        deleted_at: null,
      },
      orderBy: {
        published_date: "desc",
      },
      skip: skip_books,
      take: books_per_page,
    });

    const total_pages = Math.ceil(
      (await db.book.count({
        where: {
          status: BookStatus.PUBLISHED,
          deleted_at: null,
        },
      })) / books_per_page
    );

    const data = {
      title: ``,
      products: books,
      page: page,
      pages: total_pages,
    };

    const seo_data = {
      slug: `/browse${page > 1 ? `/${page}` : ``}`,
      page: page,
      meta_title: `Katalog Chapter Web Novel Lengkap | Semua Judul Chapter Buku di Esensi Online`,
      meta_description: `Lihat seluruh koleksi judul web novel di Esensi Online. Temukan cerita favoritmu dari berbagai genre seperti fantasi, romantis, aksi, dan banyak lagi. Update setiap hari!`,
      image: ``,
      headings: `Katalog Chapter Lengkap Web Novel di Esensi Online`,
      h2: `Jelajahi Semua Judul Cerita dari Berbagai Genre`,
      h3: `Cari Berdasarkan Genre, Judul, atau Penulis`,
      h4: `Update Terbaru di Esensi Online`,
      h5: `Bergabunglah dengan Komunitas Pembaca Esensi Online`,
      paragraph: `Selamat datang di katalog lengkap Esensi Online! Di sini kamu bisa menjelajahi semua judul web novel yang tersedia—mulai dari kisah cinta yang mengharukan hingga petualangan epik penuh aksi. Gunakan fitur pencarian dan filter untuk menemukan cerita yang sesuai dengan seleramu. Koleksi kami diperbarui setiap hari untuk menghadirkan bacaan segar dan berkualitas.`,
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
