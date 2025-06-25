import { Link } from "@/lib/router";
import { Button } from "../ui/button";
import { formatMoney } from "./format-money";
import { Fragment } from "react/jsx-runtime";

export const FeaturedBooks = ({data = [] as any}) => {

  const content_empty = <div>Kosong</div>;
  const content =
    data.length > 0
      ? data.map((book, idx) => {
          const bundles_empty = <div></div>;
          const bundles =
            book.bundle_product.length > 0
              ? book.bundle_product.map((b, i) => {
                  return (
                    <Fragment key={i + "_" + idx}>
                      <img
                        src={`https://esensi.online/${b.cover.replace("_file/", "_img/")}?w=65`}
                        alt={`${b.name.replace("'", "").replace('"', "")}`}
                        className="aspect-[3/4] rounded-sm h-full w-auto"
                      />
                    </Fragment>
                  );
                })
              : { bundles_empty };

          let discval: any,
            disc_text: string,
            discount: any,
            strikePrice: any,
            strikePriceDiv: any;
          if (
            book.strike_price !== null &&
            book.strike_price !== "" &&
            book.strike_price > book.real_price
          ) {
            discval = Math.round(
              ((book.strike_price - book.real_price) / book.strike_price) * 100,
            );
            disc_text = "-" + discval + "%";
            discount = (
              <div className="flex justify-center items-center bg-[#feeeea] text-[color:#d0011b] text-[size:12px] leading-0 px-2 py-3 font-bold rounded-[3px] w-auto">
                {disc_text}
              </div>
            );
            strikePrice = (
              <div className="w-full line-through text-[12px] text-[#ccc]">
                {formatMoney(book.strike_price, book.currency)}
              </div>
            );
            strikePriceDiv = (
              <div className="flex items-center gap-3">
                {discount} {strikePrice}
              </div>
            );
          }

          const price_and_bundles = (
            <div className="flex justify-stretch items-stretch w-full lg:max-w-full max-h-[75px] md:max-h-[60px] gap-3 text-nowrap">
              <div className="flex flex-col justify-center items-start w-auto min-w-36 gap-2 md:gap-0 px-2 py-1.5 border-[1px] border-[color:#4d5094] rounded-lg">
                {strikePriceDiv}
                <div className="flex w-full justify-center text-[color:#d0011b] text-xl font-bold">
                  {formatMoney(book.real_price, book.currency)}
                </div>
              </div>
              <div className="flex flex-1 w-auto h-auto items-stretch gap-2 overflow-x-auto">
                {bundles}
              </div>
            </div>
          );

          return (
            <div
              className="flex flex-1 text-wrap md:flex-row flex-wrap justify-start items-start lg:items-start gap-4 md:max-h-[66%] md:max-w-1/2"
              key={`esensi_featured_${idx}`}
            >
              <div className="flex w-36 items-start">
                <img
                  src={`https://esensi.online/${book.cover.replace("_file/", "_img/")}?w=200`}
                  alt={`${book.name.replace("'", "").replace('"', "")}`}
                  className="aspect-3/4 w-full h-auto object-cover object-center rounded-[4px]"
                />
              </div>
              <div className="flex flex-col flex-1 wrap-break-word md:flex-1 sm:w-full md:max-w-fit h-fit items-start gap-2">
                <h3 className="font-bold leading-[1.3]">{book.name}</h3>
                <p className="text-sm">{book.desc}</p>
              </div>
              {price_and_bundles}
            </div>
          );
        })
      : { content_empty };

  return (
    <div className="flex bg-[#4d5094] p-2.5">
      <div className="flex flex-col justify-start items-center gap-8 bg-white p-4 rounded-lg">
        <div className="text-[20px] text-[color:#4d5094] font-bold">
          ★ PROMO BUNDLING ★
        </div>
        <div className="flex flex-col md:flex-row flex-wrap gap-10 md:gap-20 md:px-5">
          {content}
        </div>
        <Button asChild className="bg-[#fada54] text-[16px]">
          <Link href="/bundle">Lihat bundle hemat lainnya</Link>
        </Button>
      </div>
    </div>
  );
};
