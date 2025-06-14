import { useLocal } from "@/lib/hooks/use-local";
import { Link } from "@/lib/router";
import { Button } from "../ui/button";
import { Frown, ListFilter } from "lucide-react";
import { FilterItem } from "./filter-item";
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
        list: [
          {
            name: "sort" as string,
            label: "Urutkan" as string,
            options: [] as any,
            selected: null as string | null,
            selected_idx: null as number | null,
          },
          {
            name: "cat" as string,
            label: "Kategori" as string,
            options: [] as any,
            selected: null as string | null,
            selected_idx: null as number | null,
          },
          {
            name: "author" as string,
            label: "Penulis" as string,
            options: [] as any,
            selected: null as string | null,
            selected_idx: null as number | null,
          },
          {
            name: "discount" as string,
            label: "Diskon" as string,
            options: [
              {
                label: "Buku yang sedang diskon",
                value: "discounted",
              },
            ] as any,
            selected: null as string | null,
            selected_idx: null as number | null,
          },
          {
            name: "ratings" as string,
            label: "Ratings" as string,
            options: [
              {
                label: "1 ke atas",
                value: "1",
              },
              {
                label: "2 ke atas",
                value: "2",
              },
              {
                label: "3 ke atas",
                value: "3",
              },
              {
                label: "4 ke atas",
                value: "4",
              },
              {
                label: "5 bintang",
                value: "5",
              },
            ] as any,
            selected: null as string | null,
            selected_idx: null as number | null,
          },
        ],
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

  const handleFilterItem = (
    name = "" as string | null,
    value = null as string | null,
  ) => {
    if (name !== "" && name !== null) {
      const the_value = value !== "" ? value : null;
      if (local.filters.list[name].selected == the_value) {
        local.filters.list[name].selected = null;
      } else {
        local.filters.list[name].selected = the_value;
      }
      local.render();
    }
  };

  const handleApplyFilter = () => {
    let selectedFilters = <></>;
    local.filters.list.map((flt, idx) => {
      const selected = flt.selected !== "" ? flt.selected : null;
      if (selected) {
      }
    });
  };

  const buildFilters = local.filters.list.map((flt, idx) => {
    let filterSection = <></>;
    if (flt.options.length > 0) {
      let filterTitle = <strong className="flex font-bold">{flt.label}</strong>;
      let filterOptions = flt.options.map((o, oidx) => {
        return (
          <FilterItem
            name={idx}
            label={o?.label}
            value={o?.value}
            action={handleFilterItem}
            selected={local.filters.list[idx].selected}
            key={`esensi_book_filter_${flt.name}__${oidx}`}
          />
        );
      });

      filterSection = (
        <div
          className="flex flex-col items-start w-full gap-2.5"
          key={`esensi_book_filter_${flt.name}_${idx}`}
        >
          {filterTitle}
          <div className="flex gap-1 lg:gap-2 flex-wrap">{filterOptions}</div>
        </div>
      );
    }
    return filterSection;
  });

  const filternav = (
    <div className="flex justify-start items-center w-full gap-3">
      <Button
        variant="link"
        className="flex items-center justify-center gap-2 bg-[#EFEFEF] rounded-full pl-4 pr-4"
        onClick={(e) => {
          e.preventDefault();
          handleFilterPopup();
        }}
      >
        <ListFilter strokeWidth={1.5} color="#3030C1" />
        <span className="flex text-[#383D64]">Filter</span>
      </Button>
      <div className="flex w-px h-[80%] bg-[#383D64]"></div>
    </div>
  );
  const pagination = (
    <ul className="flex justify-center lg:container">
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
    <div className="flex w-full min-h-40 lg:min-h-50 h-auto px-6 py-4 justify-center items-center bg-[url(https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgU1yo1WjoGn3ORo8MQjhX5pIzlnkk_8a55xGT0b9Ap3rX2osccVQQIyMRnqIE6bXw7PZEUkjFK4Rq9UmZr2547ratdgsWKljHWk0cxo36IXpU59FaL-HsWTIyrBrAhA82yIfN-GlRZPguxeuuQjtIWn5E59tQ1y6Y7aJ_hRSwj4WkudbMFyaJSDiQY_aw/s1600/header-banner.png)] bg-center bg-cover bg-no-repeat bg-scroll">
      <div className="flex justify-start w-full container">
        <h2 className="text-white text-2xl lg:text-4xl font-semibold max-w-3/4">
          {title}
        </h2>
      </div>
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
    <div className="flex flex-col w-full gap-8 items-center">
      {renderTitle}
      <div className="flex flex-col gap-4 px-6 justify-center lg:container">
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
        className={`flex flex-col fixed w-full h-auto max-h-1/2 lg:max-w-sm lg:w-auto lg:min-w-2xs lg:h-full lg:max-h-none gap-8 lg:gap-5 p-4 bottom-0 left-0 lg:top-0 rounded-t-3xl lg:rounded-t-none bg-white z-[65] transition-transform ${local.filters.open ? "translate-y-0 lg:translate-x-0" : "translate-y-full translate-x-0 lg:translate-y-0 lg:-translate-x-full"}`}
      >
        <div className="flex flex-col w-full items-center gap-2 -mt-1">
          <hr className="h-1 w-10 rounded-full border-4 border-[#3030C1] lg:hidden" />
          <strong className="flex font-semibold text-2xl lg:text-lg">
            Filter
          </strong>
        </div>
        <div className="flex flex-col w-full gap-5 overflow-y-auto lg:grow-1">
          {buildFilters}
        </div>
        <div className="flex w-full">
          <Button className="bg-[#3B2C93] text-white flex justify-center items-center w-full">
            Apply filter
          </Button>
        </div>
      </div>
    </div>
  );
};
