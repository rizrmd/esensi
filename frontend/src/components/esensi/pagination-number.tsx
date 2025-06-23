import { useLocal } from "@/lib/hooks/use-local";
import { Link } from "@/lib/router";

export const PaginationNumber = ({
  items_per_page = 1 as number,
  current = 1 as number,
  total_pages = 1 as number,
  url,
}) => {
  const local = useLocal(
    {
      current: current,
      total_pages: total_pages,
      maxlist: 5,
      items: items_per_page,
      url_prefix: "" as string,
      url_suffix: "" as string,
      visible_pages: [] as any[],
    },
    async () => {
      if (typeof url === "string") {
        local.url_prefix = url;
      } else {
        if (url?.prefix) {
          local.url_prefix = url.prefix;
        }
        if (url?.suffix) {
          local.url_suffix = url.suffix;
        }
      }
      local.visible_pages = getPaginationRange(
        current,
        total_pages,
        local.maxlist
      );
      local.render();
    }
  );

  const getPaginationRange = (
    currentPage: number,
    totalPages: number,
    visibleLinks: number
  ) => {
    if (totalPages <= visibleLinks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfLinks = Math.floor(visibleLinks / 2);
    let start = Math.max(currentPage - halfLinks, 1);
    let end = Math.min(currentPage + halfLinks, totalPages);

    if (start === 1) {
      end = Math.min(visibleLinks, totalPages);
    }

    if (end === totalPages) {
      start = Math.max(totalPages - visibleLinks + 1, 1);
    }

    let range = [] as any[];
    if (start > 1) {
      range.push(1, "...");
    }
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    if (end < totalPages) {
      range.push("...", totalPages);
    }
    return range;
  };
  const prev = local.current !== 1 && local.total_pages !== 1 ? (
    <Link href={`${local.url_prefix}`} className="flex px-3">« Prev page</Link>
  ) : (
    <span className="flex grow-1 border-none opacity-0 lg:hidden"></span>
  );
  const next = local.current !== local.total_pages ? (
    <Link href={`${local.url_prefix}`} className="flex px-3">Next page »</Link>
  ) : (
    <span className="flex grow-1 border-none opacity-0 lg:hidden"></span>
  );

  const list = local.visible_pages.map((p, idx) => {
    let the_page = <></>;
    const classes = "hidden lg:flex";
    if (p == local.current || p == "...") {
      the_page = (
        <span key={`esensi_pagenumber_${idx}`} className={classes}>
          {p}
        </span>
      );
    } else {
      the_page = (
        <Link
          href={`${local.url_prefix}${p}${local.url_suffix}`}
          className={classes}
          key={`esensi_pagenumber_${idx}`}
        >
          {p}
        </Link>
      );
    }
    return the_page;
  });

  const renderPagination = local.total_pages > 1 && (
    <ul className="flex w-full justify-between lg:justify-center items-center gap-2 [&>*]:transition-all [&>*]:h-10 [&>*]:min-w-10 [&>*]:border-2 [&>*]:border-[#E1E5EF] [&>*]:justify-center [&>*]:items-center [&>a]:bg-[#E1E5EF] [&>a]:hover:bg-[#3b2c93] [&>a]:hover:border-[#3b2c93] [&>a]:hover:text-white [&>*]:rounded-md">
      {prev}
      {list}
      {next}
    </ul>
  );

  return <>{renderPagination}</>;
};
