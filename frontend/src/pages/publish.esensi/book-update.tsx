import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
import { MyFileUpload } from "@/components/ext/my-file-upload";
import { BookChangesLog } from "@/components/publish/book-changes-log";
import { PublishMenuBar } from "@/components/publish/menu-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/global-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { getMimeType, isTwoFilesArrayTheSame } from "@/lib/utils";
import type { BookChangesLog as BookChangesLogType } from "backend/api/types";
import { BookStatus, Currency, Role, type Book } from "backend/api/types";
import type { UploadAPIResponse } from "backend/api/upload";
import { ChevronRight } from "lucide-react";
import type { author, book, book_approval } from "shared/models";

export default function BookUpdatePage() {
  const params = new URLSearchParams(location.search);
  const bookId = params.get("id") as string;

  const local = useLocal(
    {
      bookId: "",
      book: {
        name: "",
        slug: "",
        alias: "",
        desc: "",
        cover: "",
        submitted_price: 0,
        currency: "IDR",
        sku: "",
        status: BookStatus.DRAFT,
        published_date: new Date(),
        is_physical: false,
        is_chapter: false,
        preorder_min_qty: 0,
        content_type: "text",
        info: {},
      } as unknown as book & {
        author: author | null;
        book_approval: book_approval[];
        book_changes_log: BookChangesLogType[];
      },
      loading: true,
      error: "",
      success: "",
      isSubmitting: false,
      files: {
        old: [] as File[],
        new: [] as File[],
      },
    },
    async () => {
      if (!bookId || bookId === "") {
        local.error = "ID buku tidak ditemukan";
        local.loading = false;
        local.render();
        return;
      }

      try {
        const res = await api.book_detail({ id: bookId });
        if (res && res.data) {
          local.bookId = bookId;
          local.book = res.data;

          if (local.book.status !== BookStatus.DRAFT) {
            navigate(`/book-step?id=${bookId}`);
            return;
          }

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
        } else local.error = "Buku tidak ditemukan";
      } catch (err) {
        local.error = "Terjadi kesalahan saat mengambil data buku";
        console.error(err);
      } finally {
        local.loading = false;
        local.render();
      }
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const submitBook = async (
    status: BookStatus.DRAFT | BookStatus.SUBMITTED
  ) => {
    if (!local.book.name) {
      Alert.info("Nama buku tidak boleh kosong.");
      local.error = "Nama buku tidak boleh kosong.";
      local.render();
      return;
    }

    if (!local.book.submitted_price) {
      Alert.info("Harga buku tidak boleh kosong.");
      local.error = "Harga buku tidak boleh kosong.";
      local.render();
      return;
    }

    if (!local.files.new.length) {
      Alert.info("Cover buku harus diunggah.");
      local.error = "Cover buku harus diunggah.";
      local.render();
      return;
    }

    local.book.status = status;
    local.isSubmitting = true;
    local.error = "";
    local.success = "";
    local.render();

    try {
      // Upload cover image if available and new
      if (
        local.files.new.length > 0 &&
        !isTwoFilesArrayTheSame(local.files.new, local.files.old)
      ) {
        const file = local.files.new[0];
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${baseUrl.auth_esensi}/api/upload`, {
          method: "POST",
          body: formData,
        });
        const uploaded: UploadAPIResponse = await res.json();
        if (uploaded.name) local.book.cover = uploaded.name;
      }

      const res = await api.book_update({
        id: bookId,
        data: local.book,
      });

      if (res.success && res.data) {
        local.success = "Buku berhasil diperbarui!";
        setTimeout(() => {
          navigate(`/book-step?id=${res.data?.id}`);
        }, 1500);
      } else {
        local.error = res.message || "Gagal memperbarui buku.";
      }
    } catch (err) {
      local.error = "Terjadi kesalahan saat menghubungi server.";
      console.error(err);
    } finally {
      local.isSubmitting = false;
      local.render();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | boolean | Date = value;

    if (type === "number") {
      processedValue = parseFloat(value) || 0;
    } else if (type === "datetime-local") {
      processedValue = value ? new Date(value) : new Date();
    }

    local.book = {
      ...local.book,
      [name]: processedValue,
    };
    local.render();
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    local.book = {
      ...local.book,
      [name]: checked,
    };
    local.render();
  };

  if (local.loading) return <AppLoading />;

  return (
    <Protected
      role={[Role.AUTHOR, Role.PUBLISHER]}
      onLoad={async ({ user }) => {
        if (user && !user.idAuthor) await api.register_user({ user });
      }}
      // fallback={({ missing_role }) => {
      //   if (
      //     missing_role.some((x) => x === Role.AUTHOR || x === Role.PUBLISHER)
      //   ) {
      //     navigate("/onboarding");
      //     return <AppLoading />;
      //   }
      //   return null;
      // }}
    >
      <div className="flex min-h-svh flex-col bg-gray-50">
        <PublishMenuBar />
        <main className="flex-1">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            {local.error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 shadow-sm">
                {local.error}
              </div>
            ) : null}

            {local.success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-8 shadow-sm">
                {local.success}
              </div>
            ) : null}

            <Card className="shadow-md border border-gray-200">
              {/* Breadcrumb Navigation */}
              <div className="px-6 pt-6">
                <nav className="flex items-center text-sm text-gray-600 mb-4">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
                  >
                    Beranda
                  </button>
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                  <button
                    onClick={() => navigate("/manage-book")}
                    className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
                  >
                    Daftar Buku
                  </button>
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                  <button
                    onClick={() => navigate(`/book-step?id=${bookId}`)}
                    className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
                  >
                    Proses Buku
                  </button>
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                  <span className="text-gray-800 font-medium">
                    Perbarui Buku
                  </span>
                </nav>

                {/* Divider line */}
                <div className="border-b border-gray-200"></div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Perbarui Buku
                </CardTitle>
                <CardDescription>
                  Silahkan edit formulir di bawah untuk memperbarui buku.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nama Buku</Label>
                      <Input
                        id="name"
                        name="name"
                        value={local.book.name}
                        onChange={handleChange}
                        placeholder="Masukkan nama buku"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        name="slug"
                        value={local.book.slug}
                        onChange={handleChange}
                        placeholder="contoh-nama-buku"
                        required
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Slug akan digunakan untuk URL buku
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="alias">Alias (Opsional)</Label>
                      <Input
                        id="alias"
                        name="alias"
                        value={local.book.alias || ""}
                        onChange={handleChange}
                        placeholder="Alias buku"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="desc">Deskripsi</Label>
                      <Textarea
                        id="desc"
                        name="desc"
                        value={local.book.desc || ""}
                        onChange={handleChange}
                        placeholder="Deskripsi buku"
                        className="mt-1"
                        rows={4}
                      />
                    </div>

                    <div>
                      <MyFileUpload
                        title="Cover Buku"
                        files={local.files.new}
                        accept="image/*"
                        onImageChange={(files) => {
                          local.files.new = files;
                          local.render();
                        }}
                        initialImage={
                          local.book.cover
                            ? `${baseUrl.auth_esensi}/${local.book.cover}`
                            : undefined
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="submitted_price">Harga</Label>
                        <Input
                          id="submitted_price"
                          name="submitted_price"
                          type="number"
                          value={
                            local.book.submitted_price
                              ? Number(local.book.submitted_price)
                              : 0
                          }
                          onChange={handleChange}
                          placeholder="0"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="currency">Mata Uang</Label>
                        <select
                          id="currency"
                          name="currency"
                          value={local.book.currency}
                          onChange={handleChange}
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {Object.values(Currency).map((currency) => (
                            <option key={currency} value={currency}>
                              {currency}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="published_date">Tanggal Terbit</Label>
                      <Input
                        id="published_date"
                        name="published_date"
                        type="datetime-local"
                        value={
                          local.book.published_date
                            ? new Date(local.book.published_date)
                                .toISOString()
                                .slice(0, 16)
                            : new Date().toISOString().slice(0, 16)
                        }
                        onChange={handleChange}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sku">SKU (Opsional)</Label>
                      <Input
                        id="sku"
                        name="sku"
                        value={local.book.sku || ""}
                        onChange={handleChange}
                        placeholder="Stock Keeping Unit"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="content_type">Tipe Konten</Label>
                      <Input
                        id="content_type"
                        name="content_type"
                        value={local.book.content_type || ""}
                        onChange={handleChange}
                        placeholder="Contoh: ebook, video, audio"
                        className="mt-1"
                      />
                    </div>

                    <div className="flex space-x-5">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="is_physical"
                          checked={local.book.is_physical}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              "is_physical",
                              checked === true
                            )
                          }
                        />
                        <Label htmlFor="is_physical">Buku Fisik?</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="is_chapter"
                          checked={local.book.is_chapter}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("is_chapter", checked === true)
                          }
                        />
                        <Label htmlFor="is_chapter">Chapter?</Label>
                      </div>
                    </div>

                    {local.book.is_physical && (
                      <div>
                        <Label htmlFor="preorder_min_qty">
                          Minimal Preorder
                        </Label>
                        <Input
                          id="preorder_min_qty"
                          name="preorder_min_qty"
                          type="number"
                          value={
                            local.book.preorder_min_qty
                              ? Number(local.book.preorder_min_qty)
                              : 0
                          }
                          onChange={handleChange}
                          placeholder="0"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/book-step?id=${bookId}`)}
                    >
                      Batal
                    </Button>
                  </div>
                  {bookId && local.bookId && (
                    <div className="flex space-x-3">
                      {local.book.status === BookStatus.DRAFT && (
                        <Button
                          type="button"
                          onClick={() => submitBook(BookStatus.DRAFT)}
                          disabled={local.isSubmitting}
                        >
                          {local.isSubmitting ? (
                            <span>Menyimpan...</span>
                          ) : (
                            <span>Simpan Sebagai Draft</span>
                          )}
                        </Button>
                      )}
                      <Button
                        type="button"
                        onClick={() => submitBook(BookStatus.SUBMITTED)}
                        disabled={local.isSubmitting}
                      >
                        {local.isSubmitting ? (
                          <span>Menyimpan...</span>
                        ) : (
                          <span>Simpan dan Ajukan</span>
                        )}
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </form>

              {/* Changes Log Section */}
              <BookChangesLog
                className="px-6"
                book={local.book as Book}
                onReloadData={(log: BookChangesLogType[] | undefined) => {
                  local.book.book_changes_log = log!;
                  local.render();
                }}
              />
            </Card>
          </div>
        </main>
      </div>
    </Protected>
  );
}
