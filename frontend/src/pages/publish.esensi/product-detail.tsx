import { Breadcrumb } from "@/components/ext/book/breadcrumb/product/detail";
import { ItemDetails, product } from "@/components/ext/book/item-detail";
import { Error } from "@/components/ext/error";
import { Img } from "@/components/ext/img/detail";
import { Layout } from "@/components/ext/layout/publish.esensi";
import { MenuBarPublish } from "@/components/ext/menu-bar/publish";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { baseUrl } from "@/lib/gen/base-url";
import { api } from "@/lib/gen/publish.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import { type Product } from "backend/lib/types";

export default () => {
  const local = useLocal(
    {
      product: null as Product | null,
      loading: true,
      error: "",
    },
    async () => {
      const params = new URLSearchParams(location.search);
      const id = params.get("id");
      if (!id) {
        local.error = "Produk tidak ditemukan.";
        local.loading = false;
        local.render();
        return;
      }
      try {
        const res = await api.product_detail({ id });
        if (!res.data) local.error = "Produk tidak ditemukan.";
        else local.product = res.data;
      } catch (error) {
        local.error = "Terjadi kesalahan saat memuat data produk.";
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
            <Breadcrumb />
            <h1 className="mb-6 text-2xl font-bold">Detil Produk</h1>
            <Error msg={local.error}>
              {local.product && (
                <Card className="shadow-md border border-gray-200">
                  <Img
                    check={!!local.product.cover}
                    src={baseUrl.publish_esensi + "/" + local.product.cover}
                    alt={local.product.name}
                  />
                  <CardHeader>
                    <CardTitle className="text-xl font-bold mb-2">
                      {local.product.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ItemDetails list={product(local.product)} />
                  </CardContent>
                </Card>
              )}
            </Error>
          </div>
        </div>
      </main>
    </Layout>
  );
};
