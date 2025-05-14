import { SeoTemplate } from "backend/components/SeoTemplate";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "cart",
  url: "/cart",
  async handler() {
    const req = this.req!;

    const params = {
      type: ``,
      id: ``,
    };

    const cart = {
      calculate: () => { },
      load: () => { },
      currency: "Rp.",
      total: 0,
    };

    type CartItem = {
      id: string;
      name?: string;
      slug?: string;
      cover?: string;
      real_price?: number;
      strike_price?: number;
      currency?: string;
      type: "bundle" | "product";
      bundleProducts?: string[];
      bundleDetails?: {
        id: string;
        name: string;
      }[];
    };

    //const uid = this?.session?.user.id;
    const uid = ``;


    let data = {
      title: `Keranjang Belanja`,
      items: [] as CartItem[],
      currency: "Rp.",
      subtotal: 0,
      diskon: 0,
      diskon_persen: 0,
      total: 0,
    };

    const saveToStore = () => {
      localStorage.setItem(
        "esensi-cart",
        JSON.stringify(
          data.items?.map((e) => ({
            id: e.id,
            type: e.type
          }))
        ),
      );
    };

    const calculate = () => {
      cart.calculate();
      data.currency = cart.currency;
      data.total = cart.total;
    };


    let item = {} as CartItem;

    if (params.type === "product") {
      const product = await db.product.findFirst({
        where: { id: params?.id },
        select: {
          id: true,
          name: true,
          slug: true,
          cover: true,
          real_price: true,
          strike_price: true,
          currency: true,
        },
      });
      if (product) {

        item = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          cover: product.cover,
          currency: product.currency,
          real_price:
            typeof product.real_price === "object"
              ? product.real_price.toNumber()
              : product.real_price,
          strike_price:
            typeof product.strike_price === "object"
              ? product.strike_price?.toNumber() ?? 0
              : product.strike_price,
          type: "product",
          bundleProducts: [],
        };
      }
    } else if (params.type === "bundle") {
      const bundle = await db.bundle.findFirst({
        where: { id: params.id },
        select: {
          id: true,
          name: true,
          slug: true,
          strike_price: true,
          cover: true,
          real_price: true,
          currency: true,
        },
      });
      if (bundle) {

        let bundleProducts = await db.bundle_product.findMany({
          where: { id_bundle: bundle.id },
          select: { id_product: true },
        });
        item = {
          id: bundle.id,
          name: bundle.name,
          slug: bundle.slug,
          cover: bundle.cover,
          currency: bundle.currency,
          real_price:
            typeof bundle.real_price === "object"
              ? bundle.real_price.toNumber()
              : bundle.real_price,
          strike_price:
            typeof bundle.strike_price === "object"
              ? bundle.strike_price?.toNumber() ?? 0
              : bundle.strike_price,
          type: "bundle",
          bundleProducts: bundleProducts.map((x) => x.id_product),
        };
      }
    }

    if (item) {
      if (
        !data.items.find((e) => e.type === item.type && e.id === item.id)
      ) {
        data.items.push(item);
        saveToStore();
        // toast.dismiss();
        // success({
        //   body: (
        //     <>
        //       Item:{" "}
        //       <b className={css`font-weight:bold;text-decoration:underline;`}>
        //         {item.name}
        //       </b>
        //       , berhasil masuk ke cart
        //     </>
        //   ),
        // });
      }
    }

    calculate();

    let diskon = 0;
    let sebelum_diskon = 0;
    for (const item of data.items) {
      let item_strike_price = item?.strike_price ? item.strike_price : 0;
      sebelum_diskon += item_strike_price * 1;
      if (item.strike_price) {
        let item_real_price = item?.real_price ? item.real_price : 0;
        diskon += item.strike_price - item_real_price;
      }
    }

    data.subtotal = sebelum_diskon;
    data.diskon = diskon;
    data.diskon_persen = Math.round((diskon / sebelum_diskon) * 100);

    const seo_data = {
      slug: `/cart`,
      meta_title: `Keranjang Belanja | Cek & Lanjutkan Pembelian Ebook Digitalmu`,
      meta_description: `Lihat item yang telah Anda pilih di keranjang belanja. Lanjutkan ke pembayaran dan dapatkan segera akses download dan baca ebook.`,
      image: ``,
      headings: `Keranjang Belanja | Cek & Lanjutkan Pembelian Ebook Digitalmu`,
      paragraph: `Lihat item yang telah Anda pilih di keranjang belanja. Lanjutkan ke pembayaran dan dapatkan segera akses download dan baca ebook.`,
      is_product: false,
    };

    return {
      jsx: (<><SeoTemplate data={seo_data} /></>),
      data: data,
    };
  },
});
