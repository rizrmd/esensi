import { MainEsensiLayout } from "@/components/esensi/layout";
import { useLocal } from "@/lib/hooks/use-local";
import { api } from "@/lib/gen/main.esensi";
import { Link } from "@/lib/router";
import { formatMoney } from "@/components/esensi/format-money";
import { Star } from "lucide-react";

export default (data: Awaited<ReturnType<typeof api.product>>["data"]) => {
  const header_config = {
    enable: true,
    logo: false,
    back: true,
    search: false,
    title: "Detail buku",
    cart: true,
    profile: true,
  };
  const local = useLocal(
    {
      loading: true as boolean,
      product: {
        name: "" as string,
        slug: "" as string,
        strike_price: null as number | null,
        real_price: null as number | null,
        desc: "" as string,
        info: [] as any[],
        currency: "" as string,
        cover: "" as string,
      },
      author: null as string | null,
      rating: 5 as number,
      lang: "Indonesia" as string,
      pages: "-" as number | string,
      format: "PDF" as string,
      categories: [] as any[],
      desc_open: false as boolean,
    },
    async () => {
      local.product = data.product;
      local.categories = data.categories;
      local.product.info.map((inf, idx) => {
        let txt = inf[0];
        txt = txt.toLowerCase();
        switch (txt) {
          case "penulis":
            local.author = inf[1];
            break;
          case "format":
            local.format = inf[1];
            break;
          case "jumlah halaman":
            local.pages = inf[1];
            break;
          case "bahasa":
            local.lang = inf[1];
            break;
        }
      });
      local.loading = false;
      local.render();
    },
  );

  let productWrapper = <></>;
  if (local.product !== null) {
    const bookCover = local.loading ? (
      <></>
    ) : (
      <img
        src={`https://esensi.online/${local.product.cover.replace("_file/", "_img/")}?w=320`}
        alt={`${local.product?.name.replace(`'`, ``).replace(`"`, ``)}`}
        className="flex max-w-1/2 aspect-3/4 object-center object-cover rounded-xs mt-6"
      />
    );

    const bookTitle = local.loading ? (
      <></>
    ) : (
      <h2 className="flex text-[#3B2C93] text-lg font-semibold leading-[1.2]">
        {local.product.name}
      </h2>
    );
    const bookAuthor = local.loading ? (
      <></>
    ) : local.author !== "" && local.author !== null ? (
      <Link href={`#`} className="flex text-[#B0B0B0]">
        {local.author}
      </Link>
    ) : (
      <></>
    );

    const bookCats = local.categories.map((c, idx) => {
      return (
        <Link
          href={c.slug}
          key={`esensi_product_cats_${c.slug}`}
          className="flex px-2 py-1"
        >
          {c.name}
        </Link>
      );
    });

    const bookInfoData = [
      {
        label: "Rating",
        value: local.rating,
      },
      {
        label: "Jumlah Halaman",
        value: `${local.pages} Halaman `,
      },
      {
        label: "Bahasa",
        value: local.lang,
      },
    ];

    const bookInfo = bookInfoData.map((inf, idx) => {
      return (
        <div className="flex flex-col flex-1 text-center gap-2 w-auto justify-center items-center">
          <label className="flex justify-center items-center font-light leading-[1.2] text-[12px] text-[#383D64]">
            {inf.label}
          </label>
          <div className="flex justify-center items-center font-bold gap-1 text-[#3B2C93] [&>svg]:h-[1em]">
            {inf.label == "Rating" ? <Star /> : <></>} <span>{inf.value}</span>
          </div>
        </div>
      );
    });
    productWrapper = (
      <div className="flex flex-col items-center justify-start">
        <div className="flex flex-col container items-center justify-start gap-5 px-6">
          <div className="flex justify-center">{bookCover}</div>
          <div className="flex w-full justify-between items-center gap-5">
            <div className="flex flex-col flex-1 gap-1.5 justify-between">
              {bookTitle} {bookAuthor}
            </div>
            <div className="flex w-auto">bookmark</div>
          </div>
          <div className="w-full flex flex-wrap justify-start items-center gap-2 [&>a]:bg-[#E1E5EF] [&>a]:text-[#383D64] [&>a]:rounded-full [&>a]:px-2 [&>a]:text-[11px]">
            {bookCats}
          </div>
          <div className="flex justify-start w-full items-start flex-col">
            <span className="flex justify-start w-auto text-[#C6011B] text-left font-bold text-3xl">
              {formatMoney(local.product.real_price, local.product.currency)}
            </span>
          </div>
          <div className="flex justify-between w-full py-4 px-4 bg-[#E1E5EF] rounded-2xl">
            {bookInfo}
          </div>
          <div
            className="flex flex-col items-start justify-start w-full gap-4"
            dangerouslySetInnerHTML={{ __html: local.product.desc }}
          ></div>
        </div>
        <div className="flex">related</div>
      </div>
    );
  } else {
    productWrapper = <div>TIDAK ADA PRODUK</div>;
  }

  return (
    <MainEsensiLayout header_config={header_config} mobile_menu={false}>
      {productWrapper}
    </MainEsensiLayout>
  );
};
