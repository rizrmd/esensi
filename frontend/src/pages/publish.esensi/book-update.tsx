import { Breadcrumb } from "@/components/ext/book/breadcrumb/update";
import { EForm } from "@/components/ext/eform/EForm";
import { Error } from "@/components/ext/error";
import { Layout } from "@/components/ext/layout/publish.esensi";
import { MenuBarPublish } from "@/components/ext/menu-bar/publish";
import { MyFileUpload } from "@/components/ext/my-file-upload";
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
import { betterAuth } from "@/lib/better-auth";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import {
  getMimeType,
  isTwoFilesArrayTheSame,
  validate,
  validateBatch,
} from "@/lib/utils";
import type { UploadAPIResponse } from "backend/api/upload";
import type { User } from "backend/lib/better-auth";
import {
  BookStatus,
  BookTypeKey,
  BookTypes,
  Currency,
  type Book
} from "backend/lib/types";
import type { book } from "shared/models";

export const current = {
  user: undefined as User | undefined,
};

export default function BookUpdatePage() {
  const local = useLocal(
    {
      bookId: null as string | null,
      book: undefined as Book | undefined,
      files: {
        old: [] as File[],
        new: [] as File[],
      },
      loading: true,
      error: "",
      success: "",
      isSubmitting: false,
    },
    async () => {
      const res = await betterAuth.getSession();
      current.user = res.data?.user;
      if (!current.user) return;
      const params = new URLSearchParams(location.search);
      local.bookId = params.get("id") as string;
      if (validate(!local.bookId, local, "ID buku tidak ditemukan.")) {
        navigate("/manage-book");
        return;
      }

      try {
        const res = await api.book_detail({ id: local.bookId });
        if (validate(!res.data, local, "Buku tidak ditemukan.")) {
          navigate("/manage-book");
          return;
        } else if (res && res.data) {
          if (res.data.status !== BookStatus.DRAFT) {
            navigate(`/book-step?id=${local.bookId}`);
            return;
          }
          local.book = res.data;
          if (res.data.cover) {
            const fetchImage = async () => {
              try {
                const imageUrl = `${baseUrl.auth_esensi}/${res.data!.cover}`;
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const fileName =
                  res.data!.cover.split("/").pop() || "cover.jpg";

                const extension = fileName.split(".").pop()?.toLowerCase();
                const mimeType = getMimeType(extension);
                const file = new File([blob], fileName, {
                  type: mimeType,
                  lastModified: new Date().getTime(),
                });

                local.files.old = [file];
                local.files.new = [file];
                local.render();
              } catch (error) {
                console.error("Error fetching cover image:", error);
              }
            };
            await fetchImage();
          }
        } else {
          navigate(`/book-step?id=${local.bookId}`);
          return;
        }
      } catch (err) {
        local.error = "Terjadi kesalahan saat mengambil data buku";
        console.error(err);
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
              <Breadcrumb id={local.bookId!} />
              <CardTitle className="text-2xl">Perbarui Buku</CardTitle>
              <CardDescription>
                Isi informasi buku di bawah ini.
              </CardDescription>
            </CardHeader>

            {local.book && (
              <EForm
                data={{
                  name: local.book?.name,
                  slug: local.book?.slug,
                  is_chapter: local.book?.is_chapter
                    ? BookTypeKey.CHAPTER
                    : BookTypeKey.UTUH,
                  is_physical: local.book?.is_physical,
                  alias: local.book?.alias,
                  desc: local.book?.desc,
                  cover: local.book?.cover,
                  submitted_price: local.book?.submitted_price,
                  currency: local.book?.currency,
                  published_date: new Date(local.book!.published_date)
                    .toISOString()
                    .slice(0, 10),
                  sku: local.book?.sku,
                  content_type: local.book?.content_type,
                  preorder_min_qty: local.book?.preorder_min_qty,
                  status: BookStatus.DRAFT,
                }}
                onSubmit={async ({ write, read }) => {
                  if (
                    validateBatch(local, [
                      {
                        failCondition: !read.name,
                        message: "Nama buku tidak boleh kosong.",
                      },
                      {
                        failCondition: !read.desc,
                        message: "Deskripsi buku tidak boleh kosong.",
                      },
                      {
                        failCondition: !local.files.new.length,
                        message: "Cover buku harus diunggah.",
                      },
                      {
                        failCondition: !read.submitted_price,
                        message: "Harga buku tidak boleh kosong.",
                      },
                      {
                        failCondition: !read.sku,
                        message: "Stock keeping unit tidak boleh kosong.",
                      },
                    ])
                  )
                    return;
                  local.isSubmitting = true;
                  local.error = "";
                  local.success = "";
                  local.render();

                  try {
                    if (
                      local.files.new.length > 0 &&
                      !isTwoFilesArrayTheSame(local.files.new, local.files.old)
                    ) {
                      const file = local.files.new[0];
                      const formData = new FormData();
                      formData.append("file", file);
                      const res = await fetch(
                        `${baseUrl.auth_esensi}/api/upload`,
                        {
                          method: "POST",
                          body: formData,
                        }
                      );
                      const uploaded: UploadAPIResponse = await res.json();
                      if (uploaded.name) write.cover = uploaded.name!;
                    }

                    const res = await api.book_update({
                      id: local.bookId!,
                      data: {
                        ...read,
                        id_author: current.user?.idAuthor!,
                        is_chapter: read.is_chapter === BookTypeKey.CHAPTER,
                        cover: write.cover,
                        published_date: new Date(read.published_date),
                      } as unknown as book,
                    });

                    if (res.success && res.data) {
                      local.success = "Buku berhasil diperbarui!";
                      navigate(`/book-step?id=${res.data?.id}`);
                    } else
                      local.error = res.message || "Gagal menambahkan buku.";
                  } catch (err) {
                    local.error = "Terjadi kesalahan saat menghubungi server.";
                    console.error(err);
                  } finally {
                    local.isSubmitting = false;
                    local.render();
                  }
                }}
              >
                {({ Field, read, write, submit }) => {
                  return (
                    <>
                      <CardContent className="space-y-6">
                        <Field
                          name="name"
                          disabled={local.loading}
                          input={{ placeholder: "Masukkan nama buku" }}
                          label="Nama Buku"
                        />
                        <Field
                          name="slug"
                          disabled={local.loading}
                          input={{ placeholder: "contoh-nama-buku" }}
                          label="Slug"
                          optional
                        />
                        <Field
                          name="is_chapter"
                          type="select"
                          disabled={local.loading}
                          options={BookTypes}
                          label="Tipe Buku"
                        />
                        <Field
                          name="is_physical"
                          type="checkbox"
                          disabled={local.loading}
                          label="Apakah buku fisik?"
                        />
                        <Field
                          name="alias"
                          disabled={local.loading}
                          input={{ placeholder: "Alias buku" }}
                          label="Alias"
                          optional
                        />
                        <Field
                          name="desc"
                          type="textarea"
                          disabled={local.loading}
                          input={{ placeholder: "Deskripsi buku" }}
                          label="Deskripsi"
                        />
                        <MyFileUpload
                          title="Cover Buku"
                          files={local.files.new}
                          accept="image/*"
                          onImageChange={(files) => {
                            local.files.new = files;
                            local.render();
                          }}
                        />
                        <Field
                          name="submitted_price"
                          type="number"
                          disabled={local.loading}
                          input={{ placeholder: "0", step: "0.01" }}
                          label="Harga Buku"
                        />
                        <Field
                          name="currency"
                          type="select"
                          disabled={local.loading}
                          label="Mata Uang"
                          options={Object.values(Currency).map((c) => ({
                            label: c,
                            key: c,
                          }))}
                        />
                        <Field
                          name="published_date"
                          type="date"
                          disabled={local.loading}
                          label="Tanggal Terbit"
                        />
                        <Field
                          name="sku"
                          disabled={local.loading}
                          input={{ placeholder: "SKU" }}
                          label="Stock Keeping Unit"
                        />
                        <Field
                          name="content_type"
                          disabled={local.loading}
                          label="Tipe Konten"
                          optional
                        />
                        <Field
                          name="preorder_min_qty"
                          type="number"
                          disabled={local.loading}
                          input={{ placeholder: "0" }}
                          label="Minimal Preorder"
                        />
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            navigate("/book-step?id=" + local.bookId!)
                          }
                        >
                          Batal
                        </Button>
                        <div className="flex space-x-3">
                          <Button
                            type="button"
                            onClick={() => {
                              write.status = BookStatus.DRAFT;
                              submit();
                            }}
                            disabled={local.loading || local.isSubmitting}
                          >
                            {local.isSubmitting ? (
                              <span>Menyimpan...</span>
                            ) : (
                              <span>Simpan Sebagai Draft</span>
                            )}
                          </Button>
                          {read.is_chapter === BookTypeKey.UTUH && (
                            <Button
                              type="button"
                              onClick={() => {
                                write.status = BookStatus.SUBMITTED;
                                submit();
                              }}
                              disabled={local.loading || local.isSubmitting}
                            >
                              {local.isSubmitting ? (
                                <span>Menyimpan...</span>
                              ) : (
                                <span>Simpan dan Ajukan</span>
                              )}
                            </Button>
                          )}
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
