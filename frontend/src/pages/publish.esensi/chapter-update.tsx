import { Breadcrumb } from "@/components/ext/chapter/breadcrumb/update";
import MyEditorJS from "@/components/ext/editor.js";
import { EForm } from "@/components/ext/eform/EForm";
import { Error } from "@/components/ext/error";
import { Layout } from "@/components/ext/layout/publish.esensi";
import { MenuBarPublish } from "@/components/ext/menu-bar/publish";
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
import { isValidEditorData, validate, validateBatch } from "@/lib/utils";
import type { OutputData } from "@editorjs/editorjs";
import type { chapter } from "shared/models";

export default function ChapterUpdatePage() {
  const local = useLocal(
    {
      bookId: undefined as string | undefined,
      id: undefined as string | undefined,
      chapter: undefined as chapter | undefined,
      formData: {
        number: 0,
        name: "",
        content: {
          time: Date.now(),
          blocks: [],
          version: "2.28.2",
        } as OutputData,
      },
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

          // Initialize form data with chapter data
          local.formData = {
            number: local.chapter!.number,
            name: local.chapter!.name,
            content: {
              time: local.chapter!.content!["time"],
              blocks: local.chapter!.content!["blocks"],
              version: local.chapter!.content!["version"],
            } as OutputData,
          };
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
          <Error msg={local.error} />
          <Success msg={local.success} />
          <Card className="shadow-md border border-gray-200">
            <CardHeader>
              <Breadcrumb bookId={local.bookId!} />
              <CardTitle className="text-2xl">Perbarui Chapter</CardTitle>
              <CardDescription>
                Isi informasi chapter di bawah ini.
              </CardDescription>
            </CardHeader>

            {local.chapter && (
              <EForm
                data={local.formData}
                onSubmit={async ({ write, read }) => {
                  if (
                    validateBatch(local, [
                      {
                        failCondition: !read.number,
                        message: "Nomor chapter tidak boleh kosong.",
                      },
                      {
                        failCondition: !read.name,
                        message: "Nama chapter tidak boleh kosong.",
                      },
                      {
                        failCondition: !read.content,
                        message: "Konten chapter tidak boleh kosong.",
                      },
                    ])
                  )
                    return;
                  local.isSubmitting = true;
                  local.error = "";
                  local.success = "";
                  local.render();

                  try {
                    const res = await api.chapter_update({
                      id: local.id!,
                      data: {
                        ...read,
                        id_book: local.bookId!,
                      } as unknown as chapter,
                    });

                    if (res.success && res.data) {
                      local.success = "Chapter berhasil diperbarui!";
                      navigate(`/manage-chapter?bookId=${local.bookId}`);
                    } else
                      local.error = res.message || "Gagal memperbarui chapter.";
                  } catch (err) {
                    local.error = "Terjadi kesalahan saat menghubungi server.";
                    console.error(err);
                  } finally {
                    local.isSubmitting = false;
                    local.render();
                  }
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
                          input={{ placeholder: "Masukkan nomor chapter" }}
                          label="Nomor Chapter"
                        />
                        <Field
                          name="name"
                          disabled={local.loading}
                          input={{ placeholder: "Masukkan nama chapter" }}
                          label="Nama Chapter"
                        />
                        <MyEditorJS
                          label="Konten Chapter"
                          data={write.content}
                          onChange={(data: OutputData) =>
                            (write.content = data)
                          }
                        />
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate("/book-step")}
                        >
                          Batal
                        </Button>
                        <div className="flex space-x-3">
                          <Button
                            type="submit"
                            disabled={local.isSubmitting || !local.bookId}
                          >
                            {local.isSubmitting ? (
                              <span>Menyimpan...</span>
                            ) : (
                              <span>Simpan</span>
                            )}
                          </Button>
                        </div>
                      </CardFooter>
                    </>
                  );
                }}
              </EForm>
            )}
          </Card>
        </div>
      </main>
    </Layout>
  );
}
