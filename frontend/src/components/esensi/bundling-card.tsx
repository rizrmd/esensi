import { Link } from "@/lib/router";
import { formatMoney } from "./format-money";

export const BundlingCard = ({ data }) => {
  let discount: any, strikePrice: any;
  if (
    data.strike_price !== null &&
    data.strike_price !== "" &&
    data.strike_price > data.real_price
  ) {
    const discval =
      "-" +
      Math.round(
        ((data.strike_price - data.real_price) / data.strike_price) * 100
      ) +
      "%";
    discount = (
      <div className="flex justify-center items-center bg-[#d0011b] text-[color:#fff] text-[size:11px] leading-0 p-2.5 font-bold rounded-full w-auto">
        {discval}
      </div>
    );
    strikePrice = formatMoney(data.strike_price, data.currency);
  }

  const bookList = data.bundle_product.map((b, idx) => {
    return <li>{b.product.name}</li>;
  });

  const bookListWrapper =
    data.bundle_product.length > 0 ? (
      <div className="flex w-full">
        <ol className="flex flex-col text-[12px] gap-1 leading-[1.2] list-decimal pl-3">
          {bookList}
        </ol>
      </div>
    ) : (
      <></>
    );

  return (
    <Link
      href={`/bundle/${data.slug}`}
      className="flex justify-center items-stretch lg:items-start gap-4 py-2 px-2 lg:px-4 relative cursor-pointer box-border w-full"
    >
      <div className="relative w-auto h-auto max-w-1/3 overflow-visible">
        <img
          src={`https://esensi.online/${data.cover.replace(
            "_file/",
            "_img/"
          )}?w=320`}
          alt={data!.name.replace("'", "").replace('"', "")}
          className="w-full h-auto aspect-3/4 object-cover object-center rounded-[4px]"
        />
      </div>
      <div className="flex flex-col grow-1 lg:min-h-full justify-start items-start gap-1">
        {discount}
        <h3 className="flex flex-1 text-lg text-[#3B2C93] font-bold leading-[1.3]">
          {data!.name}
        </h3>

        {bookListWrapper}
        <div className="flex flex-col grow-1 justify-end items-start w-full text-nowrap pt-2">
          <div className="w-full line-through text-[#a9a9a9] text-xs h-4">
            {strikePrice}
          </div>
          <div
            className={`text-lg w-auto font-bold ${
              data.strike_price !== null &&
              data.strike_price !== "" &&
              data.strike_price > data.real_price
                ? "text-[#C6011B]"
                : "text-[#000]"
            }`}
          >
            {formatMoney(data.real_price, data.currency)}
          </div>
        </div>
      </div>
    </Link>
  );
};
