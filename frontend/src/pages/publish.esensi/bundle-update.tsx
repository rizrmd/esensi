import { Protected } from "@/components/app/protected";
import { Breadcrumb } from "@/components/ext/bundle/breadcrumb/update";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { betterAuth } from "@/lib/better-auth";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import { validateBatch } from "@/lib/utils";
import type { UploadAPIResponse } from "backend/api/upload";
import { Currency, Role } from "backend/lib/types";
import { Package, X } from "lucide-react";

export default () => {
  // Get bundle ID from URL params
  const bundleId = new URLSearchParams(window.location.search).get("id");

  const local = useLocal(
    {
      authorId: undefined as string | undefined | null,
      bundleId: bundleId || "",
      bundleData: null as any,
      files: [] as File[],
      loading: true,
      error: "",
      success: "",
      isSubmitting: false,
      products: [] as any[],
      selectedProducts: [] as Array<{ id: string; qty: number; product: any }>,
    },
    async () => {
      if (!bundleId) {
        local.error = "ID bundle tidak ditemukan";
        local.loading = false;
        local.render();
        return;
      }

      const session = await betterAuth.getSession();
      local.authorId = session.data!.user.idAuthor;
      
      await Promise.all([loadBundleData(), loadProducts()]);
      local.loading = false;
      local.render();
    }
  );

  const loadBundleData = async () => {
    try {
      const response = await api.bundle_get({
        user: { idAuthor: local.authorId! },
        id: local.bundleId,
        include_categories: true,
        include_products: true,
      });

      if (response.success && response.data) {
        local.bundleData = response.data;
        
        // Set selected products from bundle data
        if (response.data.bundle_product) {
          local.selectedProducts = response.data.bundle_product.map((bp: any) => ({
            id: bp.product.id,
            qty: bp.qty,
            product: bp.product,
          }));
        }
        local.render();
      } else {
        local.error = response.message || "Gagal memuat data bundle";
      }
    } catch (error) {
      console.error("Error loading bundle data:", error);
      local.error = "Terjadi kesalahan saat memuat data bundle";
    }
  };

  const loadProducts = async () => {
    try {
      const response = await api.product_list({
        id_author: local.authorId!,
        limit: 100,
        status: "published",
      });

      if (response.success && response.data) {
        local.products = response.data || [];
        local.render();
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const addProduct = (productId: string) => {
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

  if (local.loading) {
    return (
      <Protected role={[Role.AUTHOR, Role.PUBLISHER]} fallback={PublishFallback}>
        <div className="flex min-h-svh flex-col bg-gray-50">
          <MenuBarPublish />
          <main className="flex-1">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
              <div className="text-center">Memuat data bundle...</div>
            </div>
          </main>
        </div>
      </Protected>
    );
  }

  if (!local.bundleData) {
    return (
      <Protected role={[Role.AUTHOR, Role.PUBLISHER]} fallback={PublishFallback}>
        <div className="flex min-h-svh flex-col bg-gray-50">
          <MenuBarPublish />
          <main className="flex-1">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
              <Error msg={local.error || "Bundle tidak ditemukan"} />
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/manage-bundle")}
              >
                Kembali ke Kelola Bundle
              </Button>
            </div>
          </main>
        </div>
      </Protected>
    );
  }

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
                <Breadcrumb bundleName={local.bundleData.name} />
                <CardTitle className="text-2xl">Edit Bundle</CardTitle>
                <CardDescription>
                  Edit informasi bundle di bawah ini dan pilih produk yang akan
                  dimasukkan dalam bundle.
                </CardDescription>
              </CardHeader>

              <EForm
                data={{
                  name: local.bundleData.name || "",
                  slug: local.bundleData.slug || "",
                  desc: local.bundleData.desc || "",
                  real_price: local.bundleData.real_price || 0,
                  strike_price: local.bundleData.strike_price || 0,
                  currency: local.bundleData.currency || Currency.IDR,
                  sku: local.bundleData.sku || "",
                  status: local.bundleData.status || "draft",
                  cover: local.bundleData.cover || "",
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
                        failCondition: !read.real_price,
                        message: "Harga bundle tidak boleh kosong.",
                      },
                      {
                        failCondition: !read.sku,
                        message: "SKU tidak boleh kosong.",
                      },
                      {
                        failCondition: local.selectedProducts.length === 0,
                        message: "Minimal pilih satu produk untuk bundle.",
                      },
                    ])
                  )
                    return;
                  local.isSubmitting = true;
                  local.error = "";
                  local.success = "";
                  local.render();

                  try {
                    // Upload cover file if new file is selected
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

                    const res = await api.bundle_update({
                      user: { idAuthor: local.authorId! },
                      id: local.bundleId,
                      name: read.name,
                      slug: write.slug,
                      desc: read.desc,
                      real_price: read.real_price,
                      strike_price: read.strike_price || 0,
                      currency: read.currency,
                      sku: read.sku,
                      status: read.status,
                      cover: write.cover,
                      products: local.selectedProducts.map((sp) => ({
                        id_product: sp.id,
                        qty: sp.qty,
                      })),
                    });

                    if (res.success && res.data) {
                      local.success = "Bundle berhasil diperbarui!";
                      setTimeout(() => navigate(`/manage-bundle`), 1000);
                    } else {
                      local.error = res.message || "Gagal memperbarui bundle.";
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
                          initialImage={local.bundleData.cover ? `${baseUrl.auth_esensi}/upload/${local.bundleData.cover}` : undefined}
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
                        <div className="space-y-4">
                          <label className="text-sm font-medium text-gray-700">
                            Pilih Produk untuk Bundle
                          </label>

                          <Select
                            onValueChange={(value) => addProduct(value)}
                            disabled={local.loading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih produk..." />
                            </SelectTrigger>
                            <SelectContent>
                              {local.products
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
                                    {product.real_price}
                                  </SelectItem>
                                ))}
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
                                        {sp.product.real_price}
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
