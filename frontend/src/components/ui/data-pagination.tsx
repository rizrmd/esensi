import { useEffect } from "react";

interface DataPaginationProps {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => Promise<void> | void;
  onLimitChange: (limit: number) => Promise<void> | void;
  updateUrl?: boolean;
}

export function DataPagination({
  total,
  page,
  limit,
  totalPages,
  onPageChange,
  onLimitChange,
  updateUrl = true,
}: DataPaginationProps) {
  useEffect(() => {
    if (updateUrl) {
      // Update URL with pagination params
      const url = new URL(window.location.href);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", limit.toString());
      window.history.replaceState({}, "", url.toString());
    }
  }, [page, limit, updateUrl]);

  return (
    <div className="w-full md:w-auto bg-white shadow-sm rounded-lg border border-gray-200 px-4 py-3">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-primary"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 013.01-3.1.75.75 0 11.002 1.5 1.5 1.5 0 00-1.506 1.55.75.75 0 01-.734.942 1 1 0 000 2 .75.75 0 01.734.942 1.5 1.5 0 001.506 1.55.75.75 0 11-.002 1.5 3 3 0 01-3.01-3.1.78.78 0 01.358-.442zM18.51 15.326a.78.78 0 00.358-.442 3 3 0 00-3.01-3.1.75.75 0 10-.002 1.5 1.5 1.5 0 011.506 1.55.75.75 0 00.734.942 1 1 0 110 2 .75.75 0 00-.734.942 1.5 1.5 0 01-1.506 1.55.75.75 0 10.002 1.5 3 3 0 003.01-3.1.78.78 0 00-.358-.442zM10 15a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-700">
            Total data:{" "}
            <span className="text-primary font-semibold">
              {total}
            </span>
          </span>
        </div>

        <div className="h-8 border-r border-gray-200 hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            Tampilkan
          </span>
          <select
            value={limit}
            onChange={async (e) => {
              const newLimit = parseInt(e.target.value);
              onLimitChange(newLimit);
            }}
            className="h-8 rounded-md border border-gray-200 text-sm px-2 py-0 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <div className="h-8 border-r border-gray-200 hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={async () => {
                if (page > 1) {
                  onPageChange(page - 1);
                }
              }}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <select
              value={page}
              onChange={async (e) => {
                const newPage = parseInt(e.target.value);
                onPageChange(newPage);
              }}
              className="h-8 w-16 rounded-md border border-gray-200 text-sm px-2 py-0 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            >
              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              ).map((pageNum) => (
                <option key={pageNum} value={pageNum}>
                  {pageNum}
                </option>
              ))}
            </select>

            <button
              disabled={page === totalPages}
              onClick={async () => {
                if (page < totalPages) {
                  onPageChange(page + 1);
                }
              }}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <span className="text-sm text-gray-500">
            dari {totalPages} halaman
          </span>
        </div>
      </div>
    </div>
  );
}
