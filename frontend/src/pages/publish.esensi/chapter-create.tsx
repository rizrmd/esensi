import { Protected } from "@/components/app/protected";
import { Breadcrumb } from "@/components/ext/chapter/breadcrumb/create";
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
import { validate, validateBatch } from "@/lib/utils";
import type { OutputData } from "@editorjs/editorjs";
import { Role } from "backend/lib/types";
import type { chapter } from "shared/models";

export default function ChapterCreatePage() {
  const local = useLocal(
    {
      bookId: undefined as string | undefined,
      loading: true,
      error: "",
      success: "",
      isSubmitting: false,
    },
    async () => {
      const params = new URLSearchParams(location.search);
      local.bookId = params.get("bookId") || undefined;
      if (validate(!local.bookId, local, "ID buku tidak ditemukan.")) {
        navigate("/manage-book");
        return;
      }
      try {
        const res = await api.book_detail({ id: local.bookId! });
        if (validate(!res.data, local, "Buku tidak ditemukan.")) {
          navigate("/manage-book");
          return;
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
                <CardTitle className="text-2xl">Tambah Chapter</CardTitle>
                <CardDescription>
                  Isi informasi chapter di bawah ini.
                </CardDescription>
              </CardHeader>

              <EForm
                data={{
                  number: 0,
                  name: "",
                  content: undefined as OutputData | undefined,
                }}
                onSubmit={async ({ read }) => {
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
                    const res = await api.chapter_create({
                      data: {
                        ...read,
                        id_book: local.bookId!,
                      } as unknown as chapter,
                    });

                    if (res.success && res.data) {
                      local.success = "Chapter berhasil ditambahkan!";
                      navigate(`/manage-chapter?bookId=${local.bookId}`);
                    } else
                      local.error = res.message || "Gagal menambahkan chapter.";
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
                          onClick={() =>
                            navigate("/manage-chapter?bookId=" + local.bookId)
                          }
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
            </Card>
          </div>
        </main>
      </div>
    </Protected>
  );
}
