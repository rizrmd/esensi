import { useLocal } from "@/lib/hooks/use-local";
import { BookCard } from "@/components/esensi/book-card";
import { api } from "@/lib/gen/main.esensi";
import { MainEsensiLayout } from "@/components/app/main-esensi-layout";
import type { ReactNode } from "react";

type Book = {
  name: string;
  slug: string;
  currency: string;
  real_price: number;
  strike_price: number | null;
  cover: string;
};

export default () => {
  const local = useLocal(
    {
      content: [] as ReactNode[],
    },
    async () => {
      const res = await api.all();
      local.content = res.data.map((book: Book) => (
        <BookCard
          key={book.slug}
          data={{
            image: book.cover,
            title: book.name,
            price: book.real_price,
            link: `/main.esensi/product/${book.slug}`
          }}
        />
      ));
      local.render();
    }
  );

  return (
    <MainEsensiLayout title="Semua buku" showLogo={false}>
      <div className="w-full flex flex-col justify-center gap-10 lg:px-16 lg:py-8">
        <div className="flex flex-row justify-center items-stretch flex-wrap">
          {local.content}
        </div>
      </div>
    </MainEsensiLayout>
  );
};
