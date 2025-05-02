import { Link } from "@/lib/router";
import { Button } from "../ui/button";
import { BookCard } from "./book-card";
import { ArrowRight } from "lucide-react";
import type { FC } from "react";

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
}> = ({ loading, list }) => {
  const renderBooks = list.map((book, idx) => {
    return <BookCard data={book} key={`store_books_${idx}`} />;
  });
  return (
    <div className="flex flex-col justify-center items-start gap-5">
      <div className="flex flex-row justify-center items-stretch flex-wrap">
        {renderBooks}
      </div>
      <div className="flex justify-center items-center w-full">
        <Button variant="outline" asChild>
          <Link href="/all" className="w-full">
            Semua e-book <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
};
