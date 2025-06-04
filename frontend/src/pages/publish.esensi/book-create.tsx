import { Protected } from "@/components/app/protected";
import { Breadcrumb } from "@/components/ext/book/breadcrumb/create";
import { EForm } from "@/components/ext/eform/EForm";
import { Error } from "@/components/ext/error";
import { MenuBarPublish } from "@/components/ext/menu-bar/publish";
import { MyFileUpload } from "@/components/ext/my-file-upload";
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
import { betterAuth } from "@/lib/better-auth";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { validate } from "@/lib/utils";
import { BookStatus, BookTypes, Currency, Role } from "backend/api/types";
import type { UploadAPIResponse } from "backend/api/upload";
import type { book } from "shared/models";

export default function BookCreatePage() {
  const local = useLocal(
    {
      id_author: "",
      files: [] as File[],
      loading: false,
      error: "",
      success: "",
      isSubmitting: false,
    },
    async () => {
      const session = await betterAuth.getSession();
      local.id_author = session.data!.user.idAuthor!;
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
                <Breadcrumb />
                <CardTitle className="text-2xl">Tambah Buku</CardTitle>
                <CardDescription>
                  Isi informasi buku dan chapter (jika ada) di bawah ini.
                </CardDescription>
              </CardHeader>

              <EForm
                data={{
                  name: "",
                  slug: "",
                  is_chapter: "chapter",
                  is_physical: false,
                  alias: "",
                  desc: "",
                  cover: "",
                  submitted_price: 0,
                  currency: Currency.IDR,
                  published_date: new Date().toISOString().slice(0, 10),
                  sku: "",
                  content_type: "text",
                  preorder_min_qty: 0,
                  info: {},
                  status: BookStatus.DRAFT,
                }}
                onSubmit={async ({ write, read }) => {
                  if (
                    validate(!read.name, local, "Nama buku tidak boleh kosong.")
                  )
                    return;
                  if (
                    validate(
                      !read.desc,
                      local,
                      "Deskripsi buku tidak boleh kosong."
                    )
                  )
                    return;
                  if (
                    validate(
                      !local.files.length,
                      local,
                      "Cover buku harus diunggah."
                    )
                  )
                    return;
                  if (
                    validate(
                      !read.submitted_price,
                      local,
                      "Harga buku tidak boleh kosong."
                    )
                  )
                    return;
                  if (
                    validate(
                      !read.sku,
                      local,
                      "Stock keeping unit tidak boleh kosong."
                    )
                  )
                    return;
                  local.isSubmitting = true;
                  local.error = "";
                  local.success = "";
                  local.render();

                  try {
                    let cover = "";
                    if (local.files.length > 0) {
                      const file = local.files[0];
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

                    const res = await api.book_create({
                      data: {
                        ...read,
                        id_author: local.id_author,
                        is_chapter: read.is_chapter === "chapter",
                        cover: write.cover,
                        published_date: new Date(read.published_date),
                      } as unknown as book,
                    });

                    if (res.success && res.data) {
                      local.success = "Buku berhasil ditambahkan!";

                      setTimeout(() => {
                        navigate(
                          `/${
                            read.is_chapter === "chapter"
                              ? "manage-chapter"
                              : "book-step"
                          }?id=${res.data?.id}`
                        );
                      }, 1500);
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
                          accept="image/*"
                          onImageChange={(files) => {
                            local.files = files;
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
                          onClick={() => navigate("/book-step")}
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
                            disabled={local.isSubmitting}
                          >
                            {local.isSubmitting ? (
                              <span>Menyimpan...</span>
                            ) : (
                              <span>Simpan Sebagai Draft</span>
                            )}
                          </Button>
                          <Button
                            type="button"
                            onClick={() => {
                              write.status = BookStatus.SUBMITTED;
                              submit();
                            }}
                            disabled={local.isSubmitting}
                          >
                            {local.isSubmitting ? (
                              <span>Menyimpan...</span>
                            ) : (
                              <span>Simpan dan Ajukan</span>
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
