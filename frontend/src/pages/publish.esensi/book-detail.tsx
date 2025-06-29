import { Breadcrumb } from "@/components/ext/book/breadcrumb/detail";
import { BookChangesLog } from "@/components/ext/book/changes-log";
import { book, ItemDetails } from "@/components/ext/book/item-detail";
import { Error } from "@/components/ext/error";
import { Img } from "@/components/ext/img/detail";
import { Layout } from "@/components/ext/layout/publish.esensi";
import { MenuBarPublish } from "@/components/ext/menu-bar/publish";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { validate } from "@/lib/utils";
import {
  type Book,
  type BookChangesLog as BookChangesLogType
} from "backend/lib/types";

export default () => {
  const local = useLocal(
    {
      book: undefined as Book | undefined,
      loading: true,
      error: "",
    },
    async () => {
      const params = new URLSearchParams(location.search);
      const id = params.get("id");
      if (validate(!id, local, "ID buku tidak ditemukan.")) {
        navigate("/manage-book");
        return;
      }
      try {
        const res = await api.book_detail({ id: id! });
        if (validate(!res.data, local, "Buku tidak ditemukan.")) {
          navigate("/manage-book");
          return;
        } else local.book = res.data;
      } catch (error) {
        local.error = "Terjadi kesalahan saat memuat data buku.";
      } finally {
        local.loading = false;
        local.render();
      }
    }
  );

  return (
    <Layout loading={local.loading}>
      <MenuBarPublish />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
            <Breadcrumb id={local.book?.id!} />
            <h1 className="mb-6 text-2xl font-bold">Detil Buku</h1>
            <Error msg={local.error}>
              {local.book && (
                <>
                  <Card className="shadow-md border border-gray-200">
                    <Img
                      check={!!local.book.cover}
                      src={baseUrl.publish_esensi + "/" + local.book.cover}
                      alt={local.book.name}
                    />
                    <CardHeader>
                      <CardTitle className="text-xl font-bold mb-2">
                        {local.book.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ItemDetails list={book(local.book)} />
                    </CardContent>
                  </Card>
                  <BookChangesLog
                    book={local.book}
                    onReloadData={(log: BookChangesLogType[] | undefined) => {
                      local.book!.book_changes_log = log!;
                      local.render();
                    }}
                  />
                </>
              )}
            </Error>
          </div>
        </div>
      </main>
    </Layout>
  );
};
