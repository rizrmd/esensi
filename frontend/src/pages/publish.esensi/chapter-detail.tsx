import { Protected } from "@/components/app/protected";
import { Breadcrumb } from "@/components/ext/chapter/breadcrumb/detail";
import MyEditorJS from "@/components/ext/editor.js";
import { EForm } from "@/components/ext/eform/EForm";
import { Error } from "@/components/ext/error";
import { MenuBarPublish } from "@/components/ext/menu-bar/publish";
import { PublishFallback } from "@/components/ext/publish-fallback";
import { Success } from "@/components/ext/success";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { isValidEditorData, validate } from "@/lib/utils";
import type { OutputData } from "@editorjs/editorjs";
import { Role } from "backend/api/types";
import type { chapter } from "shared/models";

export default () => {
  const local = useLocal(
    {
      bookId: undefined as string | undefined,
      id: undefined as string | undefined,
      chapter: undefined as chapter | undefined,
      loading: false,
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
          if (
            validate(
              !isValidEditorData(local.chapter!.content),
              local,
              "Konten chapter tidak valid."
            )
          ) {
            navigate(`/manage-chapter?bookId=${local.bookId}`);
            return;
          }
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
    <Protected role={[Role.AUTHOR, Role.PUBLISHER]} fallback={PublishFallback}>
      <div className="flex min-h-svh flex-col bg-gray-50">
        <MenuBarPublish />
        <main className="flex-1">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <Error msg={local.error} />
            <Success msg={local.success} />
            <Card className="shadow-md border border-gray-200">
              <CardHeader>
                <Breadcrumb bookId={local.bookId!} />
                <CardTitle className="text-2xl">Detil Chapter</CardTitle>
                <CardDescription>
                  Anda tidak dapat mengubah informasi chapter ini.
                </CardDescription>
              </CardHeader>

              {local.chapter && (
                <EForm
                  data={{
                    number: local.chapter.number,
                    name: local.chapter.name,
                    content: {
                      time: local.chapter.content!["time"],
                      blocks: local.chapter.content!["blocks"],
                      version: local.chapter.content!["version"],
                    } as OutputData,
                  }}
                >
                  {({ Field, write }) => {
                    return (
                      <>
                        <CardContent className="space-y-6">
                          <Field
                            name="number"
                            type="number"
                            disabled={local.loading}
                            readOnly={true}
                            input={{ placeholder: "Masukkan nomor chapter" }}
                            label="Nomor Chapter"
                          />
                          <Field
                            name="name"
                            disabled={local.loading}
                            readOnly={true}
                            input={{ placeholder: "Masukkan nama chapter" }}
                            label="Nama Chapter"
                          />
                          <MyEditorJS data={write.content} readOnly={true} />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/book-step")}
                          >
                            Batal
                          </Button>
                        </CardFooter>
                      </>
                    );
                  }}
                </EForm>
              )}
            </Card>
          </div>
        </main>
      </div>
    </Protected>
  );
};
