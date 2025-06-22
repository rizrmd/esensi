import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "author_stats",
  url: "/api/internal/author/stats",
  async handler(arg: { id?: string }) {
    const { id } = arg;

    if (id) {
      // Get stats for specific author
      const author = await db.author.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              book: true,
              product: true,
              publisher_author: true,
            },
          },
        },
      });

      if (!author) throw new Error("Author tidak ditemukan");

      return {
        author: {
          id: author.id,
          name: author.name,
          book_count: author._count.book,
          product_count: author._count.product,
          publisher_count: author._count.publisher_author,
        },
      };
    } else {
      // Get overall stats
      const [
        totalAuthors,
        authorsWithBooks,
        authorsWithProducts,
        authorsWithPublishers,
      ] = await Promise.all([
        db.author.count(),
        db.author.count({
          where: {
            book: {
              some: {},
            },
          },
        }),
        db.author.count({
          where: {
            product: {
              some: {},
            },
          },
        }),
        db.author.count({
          where: {
            publisher_author: {
              some: {},
            },
          },
        }),
      ]);

      return {
        total_authors: totalAuthors,
        authors_with_books: authorsWithBooks,
        authors_with_products: authorsWithProducts,
        authors_with_publishers: authorsWithPublishers,
        authors_without_content:
          totalAuthors - authorsWithBooks - authorsWithProducts,
      };
    }
  },
});
