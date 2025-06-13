import { useLocal } from "@/lib/hooks/use-local";
import { Link } from "@/lib/router";
import { Button } from "../ui/button";
import { Frown, ListFilter } from "lucide-react";
import { FilterSelected } from "./filter-selected";
import { BookCardLoading } from "./book-card-loading";
import { BookCard } from "./book-card";

export type BooksCardType = {
  name: string;
  real_price: BigInt;
  strike_price: BigInt;
  currency: string;
  cover: string;
  slug: string;
};

export const LayoutBookList = ({ title, loading, list, page, total_pages }) => {
  const local = useLocal(
    {
      title: "" as any | null,
      filters: {
        open: false as boolean,
        category: null as any,
        author: null as any,
        discounted: false as boolean,
        ratings: null as any | number,
        availability: "available" as any | null,
      },
      filters_options: {
        category: [],
        author: [],
      },
      sort: "terbaru" as any,
      paging: {
        current: 1 as number,
        total: 1 as number,
        books_per_page: 20 as number,
        list: [
          {
            label: "prev",
            page: 0,
          },
          {
            label: "next",
            page: 1,
          },
        ],
      },
    },
    async () => {},
  );

  const handlePage = (page: number) => {
    local.paging.current = page;
    local.render();
  };

  const handleFilterPopup = () => {
    local.filters.open = !local.filters.open;
    local.render();
  };

  const handleRemoveFilter = () => {
    local.render();
  };

  const filterCategory = local.filters.category !== null && (
    <FilterSelected
      label={
        local.filters.category?.slug
          ? local.filters.category?.slug
          : local.filters.category
      }
      action={handleRemoveFilter}
    />
  );

  const filterSort = local.sort !== null && (
    <FilterSelected
      label={local.sort?.slug ? local.sort?.slug : local.sort}
      action={handleRemoveFilter}
    />
  );

  const filternav = (
    <div className="flex justify-start items-center gap-3">
      <Button
        variant="link"
        className="flex items-center justify-center gap-2 bg-[#EFEFEF] rounded-full px-4"
        onClick={(e) => {
          e.preventDefault();
          handleFilterPopup();
        }}
      >
        <ListFilter strokeWidth={1.5} color="#3030C1" />
        <span className="flex text-[#383D64]">Filter</span>
      </Button>
      <div className="flex w-px h-[80%] bg-[#383D64]"></div>
      {filterCategory} {filterSort}
    </div>
  );
  const pagination = (
    <ul className="flex justify-center">
      <li>
        <Link
          href="/adad"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          1
        </Link>
      </li>
    </ul>
  );

  const renderTitle = title !== "" && title !== null && (
    <div className="flex px-6 py-4 justify-start items-center">
      <h2 className="color-white text-3xl">{title}</h2>
    </div>
  );

  const retreiveBooks = list.map((book, idx) => {
    return <BookCard data={book} key={`browse_books_${idx}`} />;
  });
  const noBooks = (
    <div className="flex flex-col justify-center items-center gap-4 w-full h-auto py-10 px-4">
      <Frown size={48} />
      <strong className="text-[#383D64] text-center text-2xl font-semibold">
        Tidak ada buku yang ditemukan
      </strong>
      <div className="text-[#383D64] text-center text-sm font-normal">
        Coba cari kategori yang lain
      </div>
    </div>
  );
  const renderBooks = list.length > 0 ? retreiveBooks : noBooks;

  const renderLoading = Array.from({ length: 8 }, (_, idx) => {
    return <BookCardLoading key={`browse_books_loading_${idx}`} />;
  });

  return (
    <div className="flex flex-col">
      {renderTitle}
      <div className="flex flex-col px-6 justify-center">
        <div className="flex">{filternav}</div>
        <div className="flex flex-row justify-start items-stretch flex-wrap gap-y-4 w-full [&>a,&>.esensi-book-loading]:w-1/2 [&>a,&>.esensi-book-loading]:md:w-1/6">
          {loading ? renderLoading : renderBooks}
        </div>
        {pagination}
      </div>

      <div
        className={`${local.filters.open ? "flex" : "hidden"} w-[100vw] h-[100vh] fixed bg-[#00000066] z-[60] top-0 left-0`}
        onClick={(e) => {
          e.preventDefault();
          handleFilterPopup();
        }}
      ></div>
      <div
        className={`flex flex-col fixed w-full h-auto p-4 bottom-0 left-0 bg-white z-[65] transition-transform ${local.filters.open ? "translate-y-0" : "translate-y-full"}`}
      >
        ini contoh filternya
        <div className="flex w-full">
          <Button className="bg-[#3B2C93] text-white flex justify-center items-center w-full">
            Apply filter
          </Button>
        </div>
      </div>
    </div>
  );
};
