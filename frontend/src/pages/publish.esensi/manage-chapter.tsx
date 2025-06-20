import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { Item, chapter as tf } from "@/components/ext/book/item-manage";
import { Breadcrumb } from "@/components/ext/chapter/breadcrumb/list";
import { Error } from "@/components/ext/error";
import { MenuBarPublish } from "@/components/ext/menu-bar/publish";
import { PublishFallback } from "@/components/ext/publish-fallback";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataPagination } from "@/components/ui/data-pagination";
import { betterAuth } from "@/lib/better-auth";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { ItemLayoutEnum, validate } from "@/lib/utils";
import type { User } from "backend/lib/better-auth";
import { BookStatus, Role, type Book } from "backend/lib/types";
import { PlusCircle, Trash2 } from "lucide-react";
import type { chapter } from "shared/models";

export const current = {
  user: undefined as User | undefined,
};

export default () => {
  const local = useLocal(
    {
      bookId: undefined as string | undefined,
      book: undefined as Book | undefined,
      chapters: [] as chapter[],
      loading: false,
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 0,
      error: "",
      layout: ItemLayoutEnum.GRID,
    },
    async () => {
      const params = new URLSearchParams(location.search);
      local.bookId = params.get("bookId") || undefined;
      if (validate(!local.bookId, local, "ID buku tidak ditemukan.")) {
        navigate("/manage-book");
        return;
      }
      local.page = parseInt(params.get("page") || ("1" as string)) as number;
      local.limit = parseInt(params.get("limit") || ("50" as string)) as number;

      const res = await betterAuth.getSession();
      current.user = res.data?.user;
      await loadData();
    }
  );

  async function loadData() {
    local.loading = true;
    local.render();

    try {
      const res = await api.book_detail({ id: local.bookId! });
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

    try {
      const res = await api.chapter_list({
        page: local.page,
        limit: local.limit,
        id_book: local.bookId,
      });
      local.chapters = res.data || [];
      local.total = res.pagination!.total || 0;
      local.page = res.pagination!.page || 0;
      local.limit = res.pagination!.limit || 0;
      local.totalPages = res.pagination!.totalPages || 0;
    } catch (error) {
      local.error = "Terjadi kesalahan saat memuat data.";
    } finally {
      local.loading = false;
      local.render();
    }
  }

  async function handleClick(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: chapter
  ) {
    if ((e.target as HTMLElement).closest("svg")) {
      await api.chapter_deletes({ ids: [item.id] });
      await loadData();
      return;
    }
    navigate(
      `${
        local.book?.status === BookStatus.DRAFT
          ? "/chapter-update"
          : "/chapter-detail"
      }?id=${item.id}&bookId=${local.bookId}`
    );
  }

  async function submitBook() {
    if (!local.bookId) return;

    local.loading = true;
    local.render();

    try {
      await api.book_update({
        id: local.bookId!,
        data: { ...local.book!, status: BookStatus.SUBMITTED },
      });
      navigate("/book-step?id=" + local.bookId);
    } catch (error) {
      local.error = "Terjadi kesalahan saat mengajukan buku.";
    } finally {
      local.loading = false;
      local.render();
    }
  }

  if (local.loading) return <AppLoading />;

  return (
    <Protected role={[Role.AUTHOR, Role.PUBLISHER]} fallback={PublishFallback}>
      <div className="flex min-h-svh flex-col bg-gray-50">
        <MenuBarPublish />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <Error msg={local.error} />
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="mx-8 py-8">
                <Breadcrumb id={local.bookId!} />
                <div className="flex justify-between items-start mb-8 gap-4">
                  <h1 className="mb-6 text-2xl font-bold">Daftar Chapter</h1>
                  <div className="flex flex-col gap-3 items-end">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            navigate(
                              "/chapter-create" +
                                (local.bookId ? `?bookId=${local.bookId}` : "")
                            )
                          }
                          disabled={
                            local.loading ||
                            !!local.error ||
                            local.book?.status !== BookStatus.DRAFT
                          }
                          className="flex items-center gap-2"
                          variant="default"
                        >
                          <PlusCircle className="h-5 w-5" />
                          <span>Tambah Chapter</span>
                        </Button>
                        <Button
                          onClick={() => submitBook()}
                          disabled={
                            local.loading ||
                            !!local.error ||
                            local.book?.status !== BookStatus.DRAFT
                          }
                          className="flex items-center gap-2"
                          variant="default"
                        >
                          <PlusCircle className="h-5 w-5" />
                          <span>Ajukan Buku</span>
                        </Button>
                      </div>
                      <DataPagination
                        total={local.total}
                        page={local.page}
                        limit={local.limit}
                        totalPages={local.totalPages}
                        onReload={loadData}
                        onPageChange={async (newPage) => {
                          local.page = newPage;
                          local.render();
                          await loadData();
                        }}
                        onLimitChange={async (newLimit) => {
                          local.limit = newLimit;
                          local.page = 1;
                          local.render();
                          await loadData();
                        }}
                        layout={local.layout}
                        onLayoutChange={(value) => {
                          local.layout = value;
                          local.render();
                        }}
                      />
                    </div>
                  </div>
                </div>
                {local.loading ? (
                  <div>Mengambil data buku...</div>
                ) : local.chapters.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    Belum ada buku.
                  </div>
                ) : (
                  <>
                    {local.layout === ItemLayoutEnum.GRID && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {local.chapters.map((item: chapter) => (
                          <div
                            key={item.id}
                            className="cursor-pointer"
                            onClick={(e) => handleClick(e, item)}
                          >
                            <Card className="flex flex-col h-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                              <CardHeader className="flex-1 relative">
                                <CardTitle className="text-lg font-semibold line-clamp-2 mb-2 pr-8">
                                  {item.name}
                                </CardTitle>
                                {local.book?.status === BookStatus.DRAFT && (
                                  <Trash2 className="h-4 w-4 absolute top-4 right-4 hover:text-red-500" />
                                )}
                              </CardHeader>
                              <CardContent className="pb-4">
                                <Item type={local.layout} item={tf(item)} />
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    )}

                    {local.layout === ItemLayoutEnum.LIST && (
                      <div className="flex flex-col gap-4">
                        {local.chapters.map((item: chapter) => (
                          <Card
                            key={item.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={(e) => handleClick(e, item)}
                          >
                            <div className="flex">
                              <div className="flex-1 p-4 relative">
                                <div className="flex justify-between items-start">
                                  <h3 className="text-lg font-semibold mb-2 pr-8">
                                    {item.name}
                                  </h3>
                                  {local.book?.status === BookStatus.DRAFT && (
                                    <Trash2 className="h-4 w-4 hover:text-red-500 flex-shrink-0" />
                                  )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  <Item type={local.layout} item={tf(item)} />
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}

                    {local.layout === ItemLayoutEnum.COMPACT && (
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="p-2 text-left text-xs font-medium text-gray-600">
                                Nomor
                              </th>
                              <th className="p-2 text-left text-xs font-medium text-gray-600">
                                Nama
                              </th>
                              {local.book?.status === BookStatus.DRAFT && (
                                <th className="p-2 text-right text-xs font-medium text-gray-600 w-12">
                                  Aksi
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {local.chapters.map((item: chapter, index) => (
                              <tr
                                key={item.id}
                                className={`border-b hover:bg-muted/50 cursor-pointer ${
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }`}
                                onClick={(e) => handleClick(e, item)}
                              >
                                <Item type={local.layout} item={tf(item)} />
                                {local.book?.status === BookStatus.DRAFT && (
                                  <td className="p-2 text-right">
                                    <Trash2 className="h-4 w-4 hover:text-red-500 inline-block" />
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Protected>
  );
};
