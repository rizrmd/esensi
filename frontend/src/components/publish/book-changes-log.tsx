import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { cn } from "@/lib/utils";
import type { Book, BookChangesLog } from "backend/api/types";
import {
  ArrowDownZA,
  ArrowUpAZ,
  ChevronDown,
  ChevronUp,
  History,
  RefreshCw,
} from "lucide-react";

function ChangesLogItem({
  book,
  key2,
  value,
}: {
  book: Book;
  key2: string;
  value: any;
}) {
  return (
    <div
      key={`old-${key2}`}
      className="mb-3 pb-3 border-b border-gray-100 last:border-b-0"
    >
      <p className="text-xs text-gray-500 mb-1">{key2}</p>
      {key2 === "cover" ? (
        <img
          src={baseUrl.publish_esensi + "/" + value + "?w=150"}
          alt={book?.name}
          className="mx-auto object-cover"
        />
      ) : null}
      {key2 === "product_file" ? (
        <a
          href={baseUrl.publish_esensi + "/" + value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {value as string}
        </a>
      ) : null}
      {key2 === "sku" ? (
        <span className="text-gray-900">{value as string}</span>
      ) : null}
      {key2 === "is_physical" ? (
        <span className="text-gray-900">{value ? "Ya" : "Tidak"}</span>
      ) : null}
      {key2 === "is_chapter" ? (
        <span className="text-gray-900">{value ? "Ya" : "Tidak"}</span>
      ) : null}
      {key2 === "content_type" ? (
        <span className="text-gray-900">{value as string}</span>
      ) : null}
      {key2 === "desc" ? (
        <div
          className="text-gray-900 mt-2 p-3 border border-gray-100 rounded-md"
          dangerouslySetInnerHTML={{
            __html: value as string,
          }}
        />
      ) : null}
      {key2 === "info" ? (
        <span className="text-gray-900">{JSON.stringify(value)}</span>
      ) : null}
      {key2 !== "cover" &&
        key2 !== "product_file" &&
        key2 !== "sku" &&
        key2 !== "is_physical" &&
        key2 !== "is_chapter" &&
        key2 !== "content_type" &&
        key2 !== "desc" &&
        key2 !== "info" && (
          <span className="text-gray-900">
            {value === null || value === undefined ? (
              <span className="text-gray-400 italic">Kosong</span>
            ) : typeof value === "object" ? (
              JSON.stringify(value, null, 2)
            ) : (
              String(value)
            )}
          </span>
        )}
    </div>
  );
}

export function BookChangesLog({
  className,
  book,
  onReloadData,
}: {
  className?: string;
  book: Book | null;
  onReloadData?: (log: BookChangesLog[] | undefined) => void;
}) {
  const local = useLocal({
    expandedLogs: {} as Record<string, boolean>,
    sort: "asc" as "asc" | "desc",
  });

  async function reloadData(bookId: string, sort?: "asc" | "desc") {
    if (sort) local.sort = sort;
    local.render();
    const list = await api.book_changes_log_list({ id_book: bookId, sort: local.sort });
    book!.book_changes_log = list.data!;
    onReloadData?.(list.data);
  }

  if (!book?.book_changes_log || book.book_changes_log.length === 0) {
    return (
      <div className={cn("mt-8", className)}>
        <p className="text-sm text-gray-500 italic">
          Tidak ada riwayat perubahan
        </p>
      </div>
    );
  }

  return (
    <div className={cn("mt-8", className)}>
      <div className="flex items-baseline justify-between">
        <div className="flex items-center mb-4">
          <History className="h-5 w-5 mr-2 text-indigo-500" />
          <h2 className="text-xl font-bold">Riwayat Perubahan</h2>
        </div>
        <div className="flex items-center space-x-2">
          {local.sort === "asc" ? (
            <ArrowUpAZ
              className="size-5 cursor-pointer"
              onClick={() => reloadData(book.id, "desc")}
            />
          ) : (
            <ArrowDownZA
              className="size-5 cursor-pointer"
              onClick={() => reloadData(book.id, "asc")}
            />
          )}
          <RefreshCw
            className="size-5 cursor-pointer"
            onClick={() => reloadData(book.id)}
          />
        </div>
      </div>

      {book.book_changes_log.map((log: BookChangesLog) => (
        <Card
          key={log.hash_value}
          className="mb-4 overflow-hidden border border-gray-200"
        >
          <CardHeader className="bg-gray-50 py-3 px-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => {
                local.expandedLogs[log.hash_value!] =
                  !local.expandedLogs[log.hash_value!];
                local.render();
              }}
            >
              <div>
                <p className="font-medium text-sm">
                  Perubahan pada{" "}
                  {new Date(log.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {local.expandedLogs[log.hash_value!] ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </CardHeader>

          {local.expandedLogs[log.hash_value!] && (
            <CardContent className="p-0">
              <div className="grid grid-cols-2 divide-x divide-gray-200">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Sebelum
                  </h3>
                  {Object.entries(log.changes!["oldFields"]).map(
                    ([key, value]) => (
                      <ChangesLogItem book={book} key2={key} value={value} />
                    )
                  )}
                  {Object.keys(log.changes!["oldFields"]).length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      Tidak ada data sebelumnya
                    </p>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Sesudah
                  </h3>
                  {Object.entries(log.changes!["newFields"]).map(
                    ([key, value]) => (
                      <ChangesLogItem book={book} key2={key} value={value} />
                    )
                  )}
                  {Object.keys(log.changes!["newFields"]).length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      Tidak ada data baru
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
