import { ItemDetails, chapter as tf } from "@/components/ext/book/item-detail";
import { Breadcrumb } from "@/components/ext/chapter/breadcrumb/detail";
import MyEditorJS from "@/components/ext/editor.js";
import { Error } from "@/components/ext/error";
import { Layout } from "@/components/ext/layout/internal.esensi";
import { MenuBarPublish } from "@/components/ext/menu-bar/publish";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { isValidEditorData, validate } from "@/lib/utils";
import type { OutputData } from "@editorjs/editorjs";
import type { chapter } from "shared/models";

export default () => {
  const local = useLocal(
    {
      bookId: undefined as string | undefined,
      id: undefined as string | undefined,
      chapter: undefined as chapter | undefined,
      loading: true,
      error: "",
      success: "",
      isSubmitting: false,
    },
    async () => {
      const params = new URLSearchParams(location.search);
      local.bookId = params.get("bookId") || undefined;
      local.id = params.get("id") || undefined;
      if (validate(!local.bookId, local, "ID buku tidak ditemukan.")) {
        navigate("/manage-book");
        return;
      }
      if (validate(!local.id, local, "ID chapter tidak ditemukan.")) {
        navigate("/manage-chapter?bookId=" + local.bookId);
        return;
      }

      try {
        const res = await api.book_detail({ id: local.bookId! });
        if (validate(!res.data, local, "Buku tidak ditemukan.")) {
          navigate("/manage-book");
          return;
        } else if (res && res.data) {
          local.chapter = res.data.chapter.find((ch) => ch.id === local.id) as
            | chapter
            | undefined;
          if (validate(!local.chapter, local, "Chapter tidak ditemukan.")) {
            navigate(`/manage-chapter?bookId=${local.bookId}`);
            return;
          }
          validate(
            !isValidEditorData(local.chapter!.content),
            local,
            "Konten chapter tidak valid."
          );
        }
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
            <Breadcrumb bookId={local.bookId!} />
            <h1 className="mb-6 text-2xl font-bold">Detil Chapter</h1>
            <Error msg={local.error}>
              {local.chapter && (
                <Card className="shadow-md border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold mb-2">
                      {local.chapter.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ItemDetails list={tf(local.chapter)} />
                    <MyEditorJS
                      data={
                        {
                          time: local.chapter.content!["time"],
                          blocks: local.chapter.content!["blocks"],
                          version: local.chapter.content!["version"],
                        } as OutputData
                      }
                      readOnly={true}
                    />
                  </CardContent>
                </Card>
              )}
            </Error>
          </div>
        </div>
      </main>
    </Layout>
  );
};
