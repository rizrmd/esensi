import { AppLoading } from "@/components/app/loading";
import { Protected } from "@/components/app/protected";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { navigate } from "@/lib/router";
import type { product } from "shared/models";

export default function ProductCreatePage() {
  const local = useLocal(
    {
      product: {
        name: "",
        slug: "",
        alias: "",
        desc: "",
        cover: "",
        price_type: "free",
        strike_price: 0,
        real_price: 0,
        currency: "IDR",
        sku: "",
        status: "draft",
        published_date: new Date(),
        is_physical: false,
        preorder_min_qty: 0,
        content_type: "text",
        info: {},
      } as unknown as product,
      loading: false,
      error: "",
      success: "",
      isSubmitting: false,
    },
    async () => {
      // Initialization logic if needed
    }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    local.isSubmitting = true;
    local.error = "";
    local.success = "";
    local.render();

    try {
      const res = await api.product_create({
        user: {}, // User information will be handled by the API
        data: local.product,
      });

      if (res.success && res.data) {
        local.success = "Produk berhasil ditambahkan!";
        setTimeout(() => {
          navigate(`/publish/product-detail?id=${res.data?.id}`);
        }, 1500);
      } else {
        local.error = res.message || "Gagal menambahkan produk.";
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

    local.product = {
      ...local.product,
      [name]: processedValue,
    };
    local.render();
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    local.product = {
      ...local.product,
      [name]: checked,
    };
    local.render();
  };

  return (
    <Protected
      role={["publisher", "author"]}
      fallback={({ missing_role }) => {
        if (
          missing_role.includes("publisher") ||
          missing_role.includes("author")
        ) {
          navigate("/onboarding");
          return <AppLoading />;
        }
      }}
    >
      {() => (
        <div className="flex min-h-svh flex-col bg-gray-50">
          <PublishMenuBar title="Tambah Produk" />
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
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    Tambah Produk Baru
                  </CardTitle>
                  <CardDescription>
                    Silahkan isi formulir di bawah untuk menambahkan produk
                    baru.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nama Produk</Label>
                        <Input
                          id="name"
                          name="name"
                          value={local.product.name}
                          onChange={handleChange}
                          placeholder="Masukkan nama produk"
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          name="slug"
                          value={local.product.slug}
                          onChange={handleChange}
                          placeholder="contoh-nama-produk"
                          required
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Slug akan digunakan untuk URL produk
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="alias">Alias (Opsional)</Label>
                        <Input
                          id="alias"
                          name="alias"
                          value={local.product.alias || ""}
                          onChange={handleChange}
                          placeholder="Alias produk"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="desc">Deskripsi</Label>
                        <Textarea
                          id="desc"
                          name="desc"
                          value={local.product.desc || ""}
                          onChange={handleChange}
                          placeholder="Deskripsi produk"
                          className="mt-1"
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label htmlFor="cover">URL Cover</Label>
                        <Input
                          id="cover"
                          name="cover"
                          value={local.product.cover || ""}
                          onChange={handleChange}
                          placeholder="https://contoh.com/gambar.jpg"
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="real_price">Harga</Label>
                          <Input
                            id="real_price"
                            name="real_price"
                            type="number"
                            value={
                              local.product.real_price
                                ? Number(local.product.real_price)
                                : 0
                            }
                            onChange={handleChange}
                            placeholder="0"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="strike_price">Harga Coret</Label>
                          <Input
                            id="strike_price"
                            name="strike_price"
                            type="number"
                            value={
                              local.product.strike_price
                                ? Number(local.product.strike_price)
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
                            value={local.product.currency}
                            onChange={handleChange}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="IDR">IDR</option>
                            <option value="USD">USD</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <select
                            id="status"
                            name="status"
                            value={local.product.status}
                            onChange={handleChange}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
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
                            local.product.published_date
                              ? new Date(local.product.published_date)
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
                          value={local.product.sku || ""}
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
                          value={local.product.content_type || ""}
                          onChange={handleChange}
                          placeholder="Contoh: ebook, video, audio"
                          className="mt-1"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="is_physical"
                          checked={local.product.is_physical}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              "is_physical",
                              checked === true
                            )
                          }
                        />
                        <Label htmlFor="is_physical">Produk Fisik</Label>
                      </div>

                      {local.product.is_physical && (
                        <div>
                          <Label htmlFor="preorder_min_qty">
                            Minimal Preorder
                          </Label>
                          <Input
                            id="preorder_min_qty"
                            name="preorder_min_qty"
                            type="number"
                            value={
                              local.product.preorder_min_qty
                                ? Number(local.product.preorder_min_qty)
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
                      onClick={() => navigate("/manage-product")}
                    >
                      Batal
                    </Button>
                    <Button type="submit" disabled={local.isSubmitting}>
                      {local.isSubmitting ? (
                        <span>Menyimpan...</span>
                      ) : (
                        <span>Simpan Produk</span>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </main>
        </div>
      )}
    </Protected>
  );
}
