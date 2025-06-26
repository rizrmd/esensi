import CSS from "csstype";
import { useLocal } from "@/lib/hooks/use-local";
import { PaginationNumber } from "./pagination-number";
import { Button } from "../ui/button";
import { Frown, ListFilter } from "lucide-react";
import { BookCard } from "./book-card";
import { BundlingCard } from "./bundling-card";
import { FilterItem } from "./filter-item";
import { FilterSelected } from "./filter-selected";
import { Breadcrumb } from "../ext/book/breadcrumb/approval";
import { Breadcrumbs } from "./breadcrumbs";

export const LayoutBookList = ({
  title = "" as string,
  loading = true as boolean,
  list = [] as any[],
  breadcrumb = [] as any[],
  pagination = {
    items: 20 as number,
    page: 1 as number,
    total_pages: 1 as number,
    url: {
      prefix: "" as string,
      suffix: "" as string,
    },
  } as any,
  isBundle = false as boolean,
}) => {
  const header_img = `https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgU1yo1WjoGn3ORo8MQjhX5pIzlnkk_8a55xGT0b9Ap3rX2osccVQQIyMRnqIE6bXw7PZEUkjFK4Rq9UmZr2547ratdgsWKljHWk0cxo36IXpU59FaL-HsWTIyrBrAhA82yIfN-GlRZPguxeuuQjtIWn5E59tQ1y6Y7aJ_hRSwj4WkudbMFyaJSDiQY_aw/s1600/header-banner.png`;
  const bannerCSS: CSS.Properties = {
    backgroundImage: `url(${header_img})`,
  };
  const local = useLocal(
    {
      loading: loading,
      filters: [
        {
          name: "sort" as string,
          label: "Urutkan" as string,
          options: [
            {
              value: "newest",
              label: "Terbaru",
            },
            {
              value: "oldest",
              label: "Terlama",
            },
            {
              value: "highest_price",
              label: "Termahal",
            },
            {
              value: "lower_price",
              label: "Termurah",
            },
            {
              value: "highest_rating",
              label: "Rating terbanyak",
            },
            {
              value: "lowest_rating",
              label: "Rating terendah",
            },
          ] as any,
          selected: [] as any,
        },
        {
          name: "cat" as string,
          label: "Kategori" as string,
          options: [] as any[],
          selected: [] as any,
        },
        {
          name: "author" as string,
          label: "Penulis" as string,
          options: [] as any[],
          selected: [] as any,
        },
        {
          name: "discount" as string,
          label: "Diskon" as string,
          options: [
            {
              label: "Buku yang sedang diskon",
              value: "discounted",
            },
          ] as any[],
          selected: [] as any,
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
          ] as any[],
          selected: [] as any,
        },
      ],
      toggleFilter: false as boolean,
    },
    async () => {
    }
  );

  const handleUpdateFilter = () => {
    local.toggleFilter = false;
    local.render();
  };


  const handleFilterPopup = (e: any) => {
    e.preventDefault();
    local.toggleFilter = !local.toggleFilter;
    local.render();
  };

  const handleFilterItem = (
    idx: number,
    value: any,
    single = false as boolean
  ) => {
    if (single) {
      local.filters[idx].selected = value;
    } else {
      if (local.filters[idx].selected.includes(value)) {
        local.filters[idx].selected = local.filters[idx].selected.filter(
          (item) => item !== value
        );
      } else {
        local.filters[idx].selected.push(value);
      }
    }
    local.render();
    if (window.innerWidth >= 1024) {
      handleUpdateFilter();
    }
  };

  const renderFilterNav = (
    <div className="flex justify-start items-center w-full gap-3">
      <Button
        variant="link"
        className="flex items-center justify-center gap-2 bg-[#EFEFEF] rounded-full pl-4 pr-4"
        onClick={handleFilterPopup}
      >
        <ListFilter strokeWidth={1.5} color="#3030C1" />
        <span className="flex text-[#383D64]">Filter</span>
      </Button>
      <div className="flex w-px h-[80%] bg-[#383D64]"></div>
    </div>
  );


  const renderFiltersWrapper = local.filters.map((filter, idx) => {
    let filterOptions = <></>;
    if (filter.name == "sort") {
      const dropdwonlist = filter.options.map((o, oidx) => {
        return (
          <option value={o.value} key={`esensi_filter_sort_${oidx}`}>
            {o.label}
          </option>
        );
      });
      filterOptions = (
        <select
          className="w-full bg-[#E1E5EF] p-2 rounded-md"
          onChange={(e) => {
            e.preventDefault();
            handleFilterItem(idx, e.target.value, true);
          }}
        >
          {dropdwonlist}
        </select>
      );
    } else {
      filterOptions = filter.options.map((o, oidx) => {
        return (
          <FilterItem
            pid={idx}
            label={o?.label}
            value={o?.value}
            action={handleFilterItem}
            selected={local.filters[idx].selected.includes(o.value)}
            key={`esensi_filter_${filter.name}__${oidx}`}
          />
        );
      });
    }
    const section = (
      <div
        className="flex flex-col items-start w-full gap-2.5"
        key={`esensi_book_filter_${filter.name}_${idx}`}
      >
        <strong className="flex font-bold">{filter.label}</strong>
        <div className="flex w-full justify-start gap-1.5 lg:gap-2.5 flex-wrap lg:flex-col lg:items-start lg:px-1">
          {filterOptions}
        </div>
      </div>
    );
    return section;
  });

  const renderList = list.map((book, idx) => {
    if (isBundle) {
      return (
        <div className="esensi-book flex w-full" key={`esensi_booklist_${idx}`}>
          <BundlingCard data={book}  key={`esensi_booklist_${idx}`} />
        </div>
      );
    } else {
      return (
        <div className="esensi-book flex w-full" key={`esensi_booklist_${idx}`}>
          <BookCard data={book} key={`esensi_booklist_${idx}`} />
        </div>
      );
    }
  });

  const renderNoBooks = (
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

  const renderPagination = (
    <>
      <PaginationNumber
        items_per_page={pagination?.items}
        current={pagination?.page}
        total_pages={pagination?.total_pages}
        url={pagination?.url}
      />
    </>
  );

  const columnsClasses = isBundle
    ? "[&>.esensi-book]:w-1/2 lg:[&>.esensi-book]:w-1/3"
    : "[&>.esensi-book]:w-1/2 lg:[&>.esensi-book]:w-1/3";

  const renderPage = (
    <div className="flex flex-col w-full items-center lg:gap-8">
      <div
        className="flex justify-center w-full h-auto p-6 bg-cover bg-center bg-no-repeat text-white text-lg font-semibold lg:text-3xl lg:h-40 lg:items-center"
        style={bannerCSS}
      >
        <h2 className="w-full max-w-[1200px]">{title}</h2>
      </div>
      <div className="flex flex-col w-full max-w-[1200px] gap-4">
        <Breadcrumbs data={breadcrumb}/>
        <div className="flex flex-col lg:flex-row lg:items-start py-8 gap-5">
          <div className="flex flex-col w-full shrink-0 lg:w-1/4 lg:gap-6">
            <div className="flex flex-wrap gap-1 px-4 lg:hidden">
              {renderFilterNav}
            </div>
            <div
              className={`${
                local.toggleFilter ? "flex" : "hidden"
              } lg:hidden bg-black fixed top-0 left-0 w-full h-full opacity-[.4] z-[65]`}
              onClick={handleFilterPopup}
            ></div>
            <div
              className={`flex flex-col fixed w-full h-auto max-h-2/3 lg:max-w-sm lg:w-auto lg:min-w-2xs gap-3 lg:gap-5 p-4 bottom-0 left-0 lg:top-0 rounded-t-3xl bg-white z-[65] transition-transform ${
                local.toggleFilter
                  ? "translate-y-0"
                  : "translate-y-full translate-x-0"
              } lg:translate-y-0 lg:translate-x-0 lg:relative lg:bottom-none lg:left-none lg:border lg:border-[#3B2C93] lg:rounded-lg lg:p-6`}
            >
              <div className="flex flex-col w-full items-center gap-1">
                <hr className="h-1 w-10 rounded-full border-4 border-[#3030C1] lg:hidden" />
                <strong className="flex font-semibold text-2xl lg:text-md lg:text-[#3B2C93]">
                  Filter
                </strong>
              </div>
              <div className="flex flex-col w-full gap-5 pb-3 overflow-y-auto lg:grow-1">
                {renderFiltersWrapper}
              </div>
              <div className="flex w-full lg:hidden">
                <Button
                  className="bg-[#3B2C93] text-white flex justify-center items-center w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    handleUpdateFilter();
                  }}
                >
                  Apply filter
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6 lg:grow-1">
            <div
              className={`flex flex-wrap justify-start gap-y-4 px-2 w-full ${columnsClasses}`}
            >
              {list.length > 0 ? renderList : renderNoBooks}
            </div>
            <div className="flex justify-center px-4">{renderPagination}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLoading = <></>;

  return <>{loading ? renderLoading : renderPage}</>;
};
