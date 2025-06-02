import { Protected } from "@/components/app/protected";
import { Breadcrumb } from "@/components/ext/book/breadcrumb/create";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/global-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { betterAuth } from "@/lib/better-auth";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { BookStatus, Currency, Role } from "backend/api/types";
import type { UploadAPIResponse } from "backend/api/upload";
import { Edit, Plus, Save, Trash2 } from "lucide-react";
import type { book, chapter } from "shared/models";

export default function BookCreatePage() {
  const local = useLocal(
    {
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
        is_chapter: true,
        preorder_min_qty: 0,
        content_type: "text",
        id_author: "",
        info: {},
      } as unknown as book,
      activeChapterIndex: -1,
      newChapter: {
        number: 1,
        name: "",
        content: "",
      },
      isEditingChapter: false,
      chapter: [] as chapter[],
      loading: false,
      error: "",
      success: "",
      isSubmitting: false,
      files: [] as File[],
    },
    async () => {
      const session = await betterAuth.getSession();
      local.book.id_author = session.data!.user.idAuthor!;
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

    if (!local.files.length) {
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
      // Upload cover image if available
      if (local.files.length > 0) {
        const file = local.files[0];
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${baseUrl.auth_esensi}/api/upload`, {
          method: "POST",
          body: formData,
        });
        const uploaded: UploadAPIResponse = await res.json();
        if (uploaded.name) local.book.cover = uploaded.name;
      }

      const res = await api.book_create({
        data: local.book,
      });

      if (res.success && res.data) {
        // If the book is a chapter, create the chapters
        if (local.book.is_chapter && local.chapter.length > 0) {
          const chapterRes = await api.chapter_create({
            data: local.chapter.map((ch) => ({
              id: "",
              id_product: null,
              id_book: res.data?.id!,
              number: ch.number,
              name: ch.name,
              content: ch.content,
            })),
          });
          if (!chapterRes.success) {
            local.error = chapterRes.message || "Gagal menambahkan chapter.";
            local.isSubmitting = false;
            local.render();
            return;
          }
        }

        local.success = "Buku berhasil ditambahkan!";
        setTimeout(() => {
          navigate(`/book-step?id=${res.data?.id}`);
        }, 1500);
      } else local.error = res.message || "Gagal menambahkan buku.";
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

    if (type === "number") processedValue = parseFloat(value) || 0;
    else if (type === "datetime-local")
      processedValue = value ? new Date(value) : new Date();

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

  const handleChapterChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    local.newChapter = {
      ...local.newChapter,
      [name]: value,
    };
    local.render();
  };

  const saveChapter = () => {
    if (!local.newChapter.name) {
      Alert.info("Nama chapter tidak boleh kosong.");
      return;
    }

    if (local.isEditingChapter) {
      let index = local.chapter.findIndex(
        (ch) => ch.number === Number(local.newChapter.number)
      );
      if (index > -1 && index !== local.activeChapterIndex) {
        Alert.info("Nomor chapter sudah ada.");
        return;
      }

      index = local.chapter.findIndex(
        (ch) => ch.name === local.newChapter.name
      );
      if (index > -1 && index !== local.activeChapterIndex) {
        Alert.info("Nama chapter sudah ada.");
        return;
      }

      if (local.activeChapterIndex >= 0) {
        local.chapter[local.activeChapterIndex] = {
          ...local.chapter[local.activeChapterIndex],
          number: local.newChapter.number,
          name: local.newChapter.name,
          content: local.newChapter.content,
        };
        local.isEditingChapter = false;
        local.activeChapterIndex = -1;
      }
    } else {
      if (local.chapter.some((ch) => ch.number === local.newChapter.number)) {
        Alert.info("Nomor chapter sudah ada.");
        return;
      }
      
      if (local.chapter.some((ch) => ch.name === local.newChapter.name)) {
        Alert.info("Nama chapter sudah ada.");
        return;
      }

      local.chapter.push({
        id: "",
        id_product: null,
        id_book: null,
        number: Number(local.newChapter.number),
        name: local.newChapter.name,
        content: local.newChapter.content,
      });
    }

    local.newChapter = { number: 1, name: "", content: "" };
    local.success = "Chapter berhasil ditambahkan!";
    local.render();
  };

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

                    <div className="flex flex-col space-y-4 py-2">
                      <Label htmlFor="is_chapter">Tipe Buku</Label>
                      <RadioGroup defaultValue="chapter">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="chapter"
                            id="chapter"
                            onClick={() =>
                              handleCheckboxChange("is_chapter", true)
                            }
                          />
                          <Label htmlFor="chapter">Chapter</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="non-chapter"
                            id="non-chapter"
                            onClick={() =>
                              handleCheckboxChange("is_chapter", false)
                            }
                          />
                          <Label htmlFor="non-chapter">Bukan Chapter</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {local.book.is_chapter && (
                      <div className="border rounded-md p-4 bg-gray-50">
                        <h3 className="text-lg font-medium mb-4">
                          Manajemen Chapter
                        </h3>

                        <div className="space-y-4 mb-6">
                          <div>
                            <Label htmlFor="chapter-number">
                              Nomor Chapter
                            </Label>
                            <Input
                              id="chapter-number"
                              name="number"
                              type="number"
                              value={Number(local.newChapter.number)}
                              onChange={handleChapterChange}
                              placeholder="1"
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label htmlFor="chapter-name">Nama Chapter</Label>
                            <Input
                              id="chapter-name"
                              name="name"
                              value={local.newChapter.name}
                              onChange={handleChapterChange}
                              placeholder="Judul chapter"
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label htmlFor="chapter-content">
                              Konten Chapter
                            </Label>
                            <Textarea
                              id="chapter-content"
                              name="content"
                              value={local.newChapter.content}
                              onChange={handleChapterChange}
                              placeholder="Konten chapter"
                              className="mt-1"
                              rows={6}
                            />
                          </div>

                          <div className="flex justify-end gap-3">
                            <Button
                              type="button"
                              onClick={saveChapter}
                              className="flex items-center"
                            >
                              {local.isEditingChapter ? (
                                <>
                                  <Save className="h-4 w-4 mr-2" /> Perbarui
                                  Chapter
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4 mr-2" /> Tambah
                                  Chapter
                                </>
                              )}
                            </Button>
                            {local.isEditingChapter && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  local.isEditingChapter = false;
                                  local.activeChapterIndex = -1;
                                  local.newChapter = {
                                    number: 1,
                                    name: "",
                                    content: "",
                                  };
                                  local.render();
                                }}
                              >
                                Batal
                              </Button>
                            )}
                          </div>
                        </div>

                        {local.chapter.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="font-medium">Daftar Chapter</h4>
                            <div className="border rounded-md overflow-hidden">
                              <table className="w-full">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="py-2 px-4 text-left">
                                      Nomor
                                    </th>
                                    <th className="py-2 px-4 text-left">
                                      Nama
                                    </th>
                                    <th className="py-2 px-4 text-left">
                                      Aksi
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {local.chapter.map((ch, index) => (
                                    <tr key={index} className="border-t">
                                      <td className="py-2 px-4">{ch.number}</td>
                                      <td className="py-2 px-4">{ch.name}</td>
                                      <td className="py-2 px-4 flex space-x-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            local.isEditingChapter =
                                              local.activeChapterIndex === index
                                                ? !local.isEditingChapter
                                                : true;
                                            if (local.isEditingChapter) {
                                              local.activeChapterIndex = index;
                                              local.newChapter = {
                                                number: ch.number,
                                                name: ch.name,
                                                content: ch.content,
                                              };
                                            } else {
                                              local.activeChapterIndex = -1;
                                              local.newChapter = {
                                                number: 1,
                                                name: "",
                                                content: "",
                                              };
                                            }
                                            local.render();
                                          }}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            local.chapter =
                                              local.chapter.filter(
                                                (_, i) => i !== index
                                              );
                                            local.render();
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

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
                        onImageChange={(files) => {
                          local.files = files;
                          local.render();
                        }}
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
                      onClick={() => submitBook(BookStatus.DRAFT)}
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
                </CardFooter>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </Protected>
  );
}
