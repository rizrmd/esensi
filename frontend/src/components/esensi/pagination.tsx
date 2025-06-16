import { useLocal } from "@/lib/hooks/use-local";
import { Link } from "@/lib/router";

export const PaginationNumber = ({
  items_per_page,
  current,
  total_pages,
  url,
}) => {
  const local = useLocal(
    {
      current: 0 as number,
      total_pages: 0 as number,
      maxlist: 7 as number,
      items: 0 as number,
      url_prefix: "" as string,
      url_suffix: "" as string,
      visible_pages: [] as any[],
    },
    async () => {
      local.items = items_per_page;
      local.current = current;
      local.total_pages = total_pages;
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
        local.maxlist,
      );
      local.render();
    },
  );

  const getPaginationRange = (
    currentPage: number,
    totalPages: number,
    visibleLinks: number,
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
  const prev = <></>;
  const next = <></>;

  const list = local.visible_pages.map((p, idx) => {
    let the_page = <></>;
    const page_classes = `flex` as string;
    if (p == local.current) {
      the_page = <span className={`${page_classes}`}>{p}</span>;
    } else {
      the_page = (
        <Link
          href={`${local.url_prefix}${p}${local.url_suffix}`}
          className={`${page_classes}`}
        >
          {p}
        </Link>
      );
    }
    return the_page;
  });

  const renderPagination = local.total_pages > 1 && (
    <ul className="flex justify-center items-center gap-2 [&>*]:h-5 [&>*]:min-w-5 [&>*]:p-1">
      {prev}
      {list}
      {next}
    </ul>
  );

  return <>{renderPagination}</>;
};
