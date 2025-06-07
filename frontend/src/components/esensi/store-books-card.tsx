import { Link } from "@/lib/router";
import { Button } from "../ui/button";
import { BookCard } from "./book-card";
import { ArrowRight, Frown } from "lucide-react";
import type { FC } from "react";
import { BookCardLoading } from "./book-card-loading";

export type StoreBooksCardItem = {
  name: string;
  real_price: BigInt;
  strike_price: BigInt;
  currency: string;
  cover: string;
  slug: string;
};

export const StoreBooksCard: FC<{
  loading: boolean;
  list: StoreBooksCardItem[];
  category: string;
}> = ({ loading, list, category }) => {


  const retreiveBooks = list.map((book, idx) => {
    return <BookCard data={book} key={`store_books_${idx}`} />;
  });

  const noBooks = (<div className="flex flex-col justify-center items-center gap-4 w-full h-auto py-10 px-4">
    <Frown size={48} />
    <strong className="text-[#383D64] text-center text-2xl font-semibold">Tidak ada buku yang ditemukan</strong>
    <div className="text-[#383D64] text-center text-sm font-normal">Coba cari kategori yang lain</div>
  </div>);
  const renderBooks = list.length > 0 ? retreiveBooks : noBooks;

  const button_link = category === "" ? "/browse" : `/category/${category}`;
  const button = loading || list.length == 0 ? (
    <></>
  ) : (
    <div className="flex justify-center items-center w-full px-6">
      <Button asChild className="w-full bg-[#3b2c93] text-white">
        <Link href={button_link}>
          See all e-books <ArrowRight />
        </Link>
      </Button>
    </div>
  );

  const renderBooksLoading = Array.from({ length: 8 }, (_, idx) => {
    return <BookCardLoading key={`store_books_loading_${idx}`} />;
  });
  return (
    <div className="flex flex-col justify-center items-start gap-5">
      <div className="flex flex-row justify-start items-stretch flex-wrap gap-y-4 w-full [&>a]:w-1/2 [&>a]:md:w-1/4 [&>a]:lg:w-1/6">
        {loading ? renderBooksLoading : renderBooks}
      </div>
      <div className="flex justify-center items-center w-full">
        {button}
      </div>
    </div>
  );
};
