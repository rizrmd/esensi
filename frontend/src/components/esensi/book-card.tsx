import { Link } from "@/lib/router";
import { formatMoney } from "./format-money";

export const BookCard = ({ data }) => {
  let discount: any, strikePrice: any;
  if (
    data.strike_price !== null &&
    data.strike_price !== "" &&
    data.strike_price > data.real_price
  ) {
    const discval =
      "-" +
      Math.round(
        ((data.strike_price - data.real_price) / data.strike_price) * 100,
      ) +
      "%";
    discount = (
      <div className="flex justify-center items-center bg-[#d0011b] text-[color:#fff] text-[size:12px] leading-0 p-3 font-bold rounded-[3px] w-auto absolute top-0 left-0 z-10 -translate-1/6">
        {discval}
      </div>
    );
    strikePrice = (
      <div className="w-full line-through text-[11px] text-[#a9a9a9]">
        {formatMoney(data.strike_price, data.currency)}
      </div>
    );
  }

  return (
    <Link
      href={`/product/${data.slug}`}
      className="w-auto flex flex-col flex-1/2 sm:flex-1/4 md:flex-1/6 justify-center items-center gap-2 relative p-5 cursor-pointer border border-[color:#d4d4d426] box-border"
    >
      <div className="relative max-w-[80%] overflow-visible">
        {discount}
        <img
          src={`https://esensi.online/${data.cover.replace("_file/", "_img/")}?w=200`}
          alt={data.name.replace("'", "").replace('"', "")}
          className="aspect-3/4 object-cover object-center rounded-[4px]"
        />
      </div>
      <h3 className="flex flex-1 text-[12px] text-center">{data.name}</h3>
      <div className="flex flex-row justify-between items-center w-full gap-3 text-nowrap">
        {strikePrice}
        <div className="w-auto text-[color:#d0011b] font-bold">
          {formatMoney(data.real_price, data.currency)}
        </div>
      </div>
    </Link>
  );
};
