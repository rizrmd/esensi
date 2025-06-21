import { useLocal } from "@/lib/hooks/use-local";
import { PaginationNumber } from "./pagination-number";
import { Button } from "../ui/button";
import { ListFilter } from "lucide-react";

export const LayoutBookList = () => {
  const local = useLocal(
    {
      loading: false as boolean,
      filters: null as any[] | null,
      list: [] as any[],
      pagination: {
        items: 20 as number,
        page: 1 as number,
        total_pages: 1 as number,
        url: {
            prefix: "" as string,
            suffix: "" as string,
        },
      } as any,

      toggleFilter: false as boolean,
    },
    async () => {}
  );

  const handleFilterPopup = (e:any) =>{
    e.preventDefault();
    local.toggleFilter = !local.toggleFilter;
    local.render();
  };
  const handleUpdateFilter = () => {};



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

  const renderSelectedFilterList = <></>;

  const renderList = <></>;
  const pagination = <><PaginationNumber items_per_page={local.pagination.items} current={local.pagination.page} total_pages={local.pagination.total_pages} url={local.pagination.url}/></>;

  const renderPage = (
    <div className="flex w-full justify-center">
      <div className="flex flex-col w-full max-w-[1200px]">
        <div className="flex flex-col lg:flex-row">

          <div className="flex flex-col lf:flex-row">
            <div className="flex  lg:hidden">{renderFilterNav} {renderSelectedFilterList}</div>
            <div className="flex">filter wrapper yang juga ngeslide</div>
          </div>

          <div className="flex flex-col lg:flex-row">{renderList}</div>
        </div>

        {!local.loading && pagination}
      </div>
    </div>
  );

  return <>{renderPage}</>;
};
