import { MainEsensiLayout } from "@/components/esensi/layout";
import { useLocal } from "@/lib/hooks/use-local";
import { api } from "@/lib/gen/main.esensi";
import { Link } from "@/lib/router";
import { formatMoney } from "@/components/esensi/format-money";
import { Bookmark, BookmarkPlus, Plus, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductBuyButtons } from "@/components/esensi/product-buy-buttons";
import { DiscountPercent } from "@/components/esensi/discount-percent";
import { CategoryList } from "@/components/esensi/category-list";

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
      product: null as any | null,
      author: null as string | null,
      rating: 5 as number,
      lang: "Indonesia" as string,
      pages: "-" as number | string,
      format: "PDF" as string,
      categories: [] as any[],
      desc_open: false as boolean,
      owned: false as boolean,
      bookmarked: false as boolean,
      inCart: false as boolean,
    },
    async () => {
      local.product = data.product;
      local.categories = data.categories;
      if (Array.isArray(data.product.info)) {
        local.product?.info.map((inf, idx) => {
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
      }
      local.owned = data.owned;
      local.bookmarked = data.bookmarked;
      local.inCart = data.in_cart;
      local.loading = false;

      local.render();
    }
  );

  const renderLoading = <></>;
  const renderNoProduct = <div>TIDAK ADA PRODUK</div>;

  const bookCover = local.loading ? (
    <></>
  ) : (
    <img
      src={`https://esensi.online/${local.product?.cover.replace(
        "_file/",
        "_img/"
      )}?w=320`}
      alt={`${local.product?.name.replace(`'`, ``).replace(`"`, ``)}`}
      className="flex max-w-1/2 lg:max-w-[280px] aspect-3/4 object-center object-cover rounded-sm"
    />
  );

  const bookTitle = local.loading ? (
    <></>
  ) : (
    <h2 className="flex text-[#3B2C93] text-lg lg:text-3xl font-semibold leading-[1.2]">
      {local.product?.name}
    </h2>
  );
  const bookAuthor = local.loading ? (
    <></>
  ) : local.author !== "" && local.author !== null ? (
    <div className="flex text-[#B0B0B0]">{local.author}</div>
  ) : (
    <></>
  );

  const bookCats = (<CategoryList data={local.categories} id={local.product?.slug} className="lg:order-4"/>);

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
      <div
        className={`flex flex-col flex-1 flex-grow text-center gap-1 w-auto py-2 px-4 lg:px-8 justify-center items-center relative${
          idx > 0 ? " esensi-with-separator" : ""
        }`}
        key={`esensi_product_info_${idx}`}
      >
        <label className="flex justify-center items-center font-light leading-[1.2] text-[10px] text-[#383D64]">
          {inf.label}
        </label>
        <div className="flex justify-center items-center text-[12px] font-bold gap-1 text-[#3B2C93] [&>svg]:h-[1em]">
          {inf.label == "Rating" ? <Star /> : <></>} <span>{inf.value}</span>
        </div>
      </div>
    );
  });

  const bookBuyButton = (
    <ProductBuyButtons
      isOwned={local.owned}
      isBookmarked={local.bookmarked}
      isInCart={local.inCart}
      productId={local.product?.id}
    />
  );

  const bookRelated = <></>;

  const renderTheProduct = (
    <div className="flex flex-col items-center justify-start">
      <div className="flex flex-col container max-w-[1200px] items-center justify-start gap-5 lg:gap-15 px-6 pt-5">
        <div className="flex flex-col w-full items-center justify-start lg:flex-row lg:justify-start lg:items-start gap-5 lg:gap-15">
          <div className="flex flex-col gap-5 items-center justify-start lg:w-2/5">
            <div className="flex justify-center">{bookCover}</div>
          </div>
          <div className="flex w-full flex-col gap-5 items-center justify-start lg:grow-1 lg:items-start">
            <div className="flex w-full justify-between items-center gap-5 lg:order-0">
              <div className="flex flex-col flex-1 gap-1.5 justify-between">
                {bookTitle} {bookAuthor}
              </div>
            </div>
            {bookCats}
            <div className="flex justify-start w-full items-start flex-col gap-1 lg:order-2">
              <DiscountPercent
                real_price={local.product?.real_price}
                strike_price={local.product?.strike_price}
                currency={local.product?.currency}
              />
              <span className="flex justify-start w-auto text-[#C6011B] text-left font-bold text-3xl">
                {formatMoney(
                  local.product?.real_price,
                  local.product?.currency
                )}
              </span>
            </div>
            <div className="flex justify-between w-full lg:w-auto lg:order-3 whitespace-pre py-2 bg-[#E1E5EF] rounded-2xl [&>.esensi-with-separator]:border-l [&>.esensi-with-separator]:border-l-[#3B2C93]">
              {bookInfo}
            </div>
            {bookBuyButton}
          </div>
        </div>
        <div className="flex flex-col w-full gap-2 py-2">
          <h3 className="text-[#3B2C93] font-bold text-lg">Sinopsis Buku</h3>
          <div
            className="flex flex-col items-start justify-start w-full gap-4 overflow-x-hidden overflow-y-hidden text-wrap"
            dangerouslySetInnerHTML={{ __html: local.product?.desc }}
          ></div>
        </div>
      </div>
      {bookRelated}
    </div>
  );

  return (
    <MainEsensiLayout header_config={header_config} mobile_menu={false}>
      {local.loading
        ? renderLoading
        : local.product == null
        ? renderNoProduct
        : renderTheProduct}
    </MainEsensiLayout>
  );
};
