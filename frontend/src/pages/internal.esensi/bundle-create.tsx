import { Protected } from "@/components/app/protected";
import { Breadcrumb } from "@/components/ext/bundle/breadcrumb/create";
import { EForm } from "@/components/ext/eform/EForm";
import { Error } from "@/components/ext/error";
import { MenuBarInternal } from "@/components/ext/menu-bar/internal";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { betterAuth } from "@/lib/better-auth";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/internal.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { validateBatch } from "@/lib/utils";
import type { UploadAPIResponse } from "backend/api/upload";
import { Currency, Role } from "backend/lib/types";
import { Package, X } from "lucide-react";

export default () => {
  const local = useLocal(
    {
      files: [] as File[],
      loading: false,
      error: "",
      success: "",
      isSubmitting: false,
      authors: [] as any[],
      products: [] as any[],
      selectedAuthor: "" as string,
      selectedProducts: [] as Array<{ id: string; qty: number; product: any }>,
    },
    async () => {
      await loadAuthors();
    }
  );

  const loadAuthors = async () => {
    try {
      const response = await api.author_list({
        limit: 100,
      });

      if (response.data) {
        local.authors = response.data || [];
        local.render();
      }
    } catch (error) {
      console.error("Error loading authors:", error);
    }
  };

  const loadProducts = async (authorId: string) => {
    try {
      // Load all published products from any author
      const response = await api.product_list({
        user: {},
        limit: 100,
        status: "published", // Ensure only published books can be added to bundles
        id_author: authorId,
      });

      if (response.success && response.data) {
        local.products = response.data.products || [];
        local.render();
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const onAuthorChange = async (authorId: string) => {
    local.selectedAuthor = authorId;
    local.selectedProducts = []; // Reset selected products when author changes
    local.products = [];
    if (authorId) {
      await loadProducts(authorId);
    }
    local.render();
  };

  const addProduct = (productId: string) => {
    // Ignore the placeholder value
    if (productId === "no-products") return;

    const product = local.products.find((p) => p.id === productId);
    if (product && !local.selectedProducts.find((sp) => sp.id === productId)) {
      local.selectedProducts.push({
        id: productId,
        qty: 1,
        product,
      });
      local.render();
    }
  };

  const removeProduct = (productId: string) => {
    local.selectedProducts = local.selectedProducts.filter(
      (sp) => sp.id !== productId
    );
    local.render();
  };

  const updateProductQty = (productId: string, qty: number) => {
    const selectedProduct = local.selectedProducts.find(
      (sp) => sp.id === productId
    );
    if (selectedProduct && qty > 0) {
      selectedProduct.qty = qty;
      local.render();
    }
  };

  return (
    <Protected role={[Role.INTERNAL]}>
      <div className="flex min-h-svh flex-col bg-gray-50">
        <MenuBarInternal />
        <main className="flex-1">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <Error msg={local.error} />
            <Success msg={local.success} />
            <Card className="shadow-md border border-gray-200">
              <CardHeader>
                <Breadcrumb />
                <CardTitle className="text-2xl">Tambah Bundle</CardTitle>
                <CardDescription>
                  Isi informasi bundle di bawah ini dan pilih produk yang akan
                  dimasukkan dalam bundle.
                </CardDescription>
              </CardHeader>

              <EForm
                data={{
                  name: "",
                  slug: "",
                  desc: "",
                  real_price: 0,
                  strike_price: 0,
                  currency: Currency.IDR,
                  sku: "",
                  status: "draft",
                  cover: "",
                }}
                onSubmit={async ({ write, read }) => {
                  if (
                    validateBatch(local, [
                      {
                        failCondition: !read.name,
                        message: "Nama bundle tidak boleh kosong.",
                      },
                      {
                        failCondition: !read.desc,
                        message: "Deskripsi bundle tidak boleh kosong.",
                      },
                      {
                        failCondition: !local.files.length,
                        message: "Cover bundle harus diunggah.",
                      },
                      {
                        failCondition: !read.real_price,
                        message: "Harga bundle tidak boleh kosong.",
                      },
                      {
                        failCondition: !read.sku,
                        message: "SKU tidak boleh kosong.",
                      },
                      {
                        failCondition: !local.selectedAuthor,
                        message: "Pilih author untuk bundle.",
                      },
                      {
                        failCondition: local.selectedProducts.length === 0,
                        message: "Minimal pilih satu produk untuk bundle.",
                      },
                      {
                        failCondition: local.selectedProducts.some(
                          (sp) => sp.product.status !== "published"
                        ),
                        message:
                          "Semua produk yang dipilih harus berstatus 'Dipublikasikan'.",
                      },
                    ])
                  )
                    return;
                  local.isSubmitting = true;
                  local.error = "";
                  local.success = "";
                  local.render();

                  try {
                    // Upload cover file
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

                    // Create slug from name if not provided
                    if (!read.slug) {
                      write.slug = read.name
                        .toLowerCase()
                        .replace(/[^a-z0-9\s]/g, "")
                        .replace(/\s+/g, "-");
                    }

                    const res = await api.bundle_create({
                      user: {},
                      name: read.name,
                      slug: write.slug,
                      desc: read.desc,
                      real_price: read.real_price,
                      strike_price: read.strike_price || 0,
                      currency: read.currency,
                      sku: read.sku,
                      status: read.status,
                      cover: write.cover,
                      id_author: local.selectedAuthor,
                      products: local.selectedProducts.map((sp) => ({
                        id_product: sp.id,
                        qty: sp.qty,
                      })),
                    });

                    if (res.success && res.data) {
                      local.success = "Bundle berhasil ditambahkan!";
                      navigate(`/manage-bundle`);
                    } else {
                      local.error = res.message || "Gagal menambahkan bundle.";
                    }
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
                        {/* Author Selection */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Pilih Author
                          </label>
                          <Select
                            onValueChange={(value) => onAuthorChange(value)}
                            disabled={local.loading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih author..." />
                            </SelectTrigger>
                            <SelectContent>
                              {local.authors.length === 0 ? (
                                <SelectItem value="no-authors" disabled>
                                  Tidak ada author
                                </SelectItem>
                              ) : (
                                local.authors.map((author) => (
                                  <SelectItem key={author.id} value={author.id}>
                                    {author.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <Field
                          name="name"
                          disabled={local.loading}
                          input={{ placeholder: "Masukkan nama bundle" }}
                          label="Nama Bundle"
                        />
                        <Field
                          name="slug"
                          disabled={local.loading}
                          input={{ placeholder: "contoh-nama-bundle" }}
                          label="Slug"
                          optional
                        />
                        <Field
                          name="desc"
                          type="textarea"
                          disabled={local.loading}
                          input={{ placeholder: "Deskripsi bundle" }}
                          label="Deskripsi"
                        />
                        <MyFileUpload
                          title="Cover Bundle"
                          accept="image/*"
                          onImageChange={(files) => {
                            local.files = files;
                            local.render();
                          }}
                        />
                        <Field
                          name="real_price"
                          type="number"
                          disabled={local.loading}
                          input={{ placeholder: "0", step: "0.01" }}
                          label="Harga Bundle"
                        />
                        <Field
                          name="strike_price"
                          type="number"
                          disabled={local.loading}
                          input={{ placeholder: "0", step: "0.01" }}
                          label="Harga Coret"
                          optional
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
                          name="sku"
                          disabled={local.loading}
                          input={{ placeholder: "SKU" }}
                          label="SKU"
                        />

                        {/* Product Selection */}
                        {local.selectedAuthor && (
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                Pilih Produk untuk Bundle
                              </label>
                              <p className="text-xs text-gray-500 mt-1">
                                Hanya produk dengan status "Dipublikasikan" yang
                                dapat ditambahkan ke bundle
                              </p>
                            </div>

                            <Select
                              onValueChange={(value) => addProduct(value)}
                              disabled={local.loading}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih produk..." />
                              </SelectTrigger>
                              <SelectContent>
                                {local.products.length === 0 ? (
                                  <SelectItem value="no-products" disabled>
                                    Tidak ada produk yang dipublikasikan
                                  </SelectItem>
                                ) : (
                                  local.products
                                    .filter(
                                      (product) =>
                                        !local.selectedProducts.find(
                                          (sp) => sp.id === product.id
                                        )
                                    )
                                    .map((product) => (
                                      <SelectItem
                                        key={product.id}
                                        value={product.id}
                                      >
                                        {product.name} - {product.currency}{" "}
                                        {product.real_price} ({product.author?.name})
                                      </SelectItem>
                                    ))
                                )}
                              </SelectContent>
                            </Select>

                            {/* Selected Products */}
                            {local.selectedProducts.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium text-gray-700">
                                  Produk yang Dipilih:
                                </h4>
                                {local.selectedProducts.map((sp) => (
                                  <div
                                    key={sp.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <Package className="h-4 w-4 text-gray-500" />
                                      <div>
                                        <p className="font-medium text-sm">
                                          {sp.product.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {sp.product.currency}{" "}
                                          {sp.product.real_price} - {sp.product.author?.name}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <label className="text-xs text-gray-600">
                                        Qty:
                                      </label>
                                      <input
                                        type="number"
                                        min="1"
                                        value={sp.qty}
                                        onChange={(e) =>
                                          updateProductQty(
                                            sp.id,
                                            parseInt(e.target.value) || 1
                                          )
                                        }
                                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeProduct(sp.id)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate("/manage-bundle")}
                        >
                          Batal
                        </Button>
                        <div className="flex space-x-3">
                          <Button
                            type="button"
                            onClick={() => {
                              write.status = "draft";
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
                          <Button
                            type="button"
                            onClick={() => {
                              write.status = "published";
                              submit();
                            }}
                            disabled={local.loading || local.isSubmitting}
                          >
                            {local.isSubmitting ? (
                              <span>Menyimpan...</span>
                            ) : (
                              <span>Simpan dan Publikasikan</span>
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
};
