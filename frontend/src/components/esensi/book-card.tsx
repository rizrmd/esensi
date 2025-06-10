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
      <div className="flex justify-center items-center bg-[#d0011b] text-[color:#fff] text-[size:13px] leading-0 p-3 font-bold rounded-full w-auto absolute top-0 left-0 z-10">
        {discval}
      </div>
    );
    strikePrice = (
      <div className="w-full line-through text-[#a9a9a9]">
        {formatMoney(data.strike_price, data.currency)}
      </div>
    );
  }

  return (
    <Link
      href={`/product/${data.slug}`}
      className="flex flex-col justify-center items-center gap-3 py-4 px-2 lg:px-4 relative cursor-pointer box-border w-full"
    >
      <div className="relative w-full h-auto overflow-visible">
        {discount}
        <img
          src={`https://esensi.online/${data.cover.replace("_file/", "_img/")}?w=320`}
          alt={data!.name.replace("'", "").replace('"', "")}
          className="w-full h-auto aspect-3/4 object-cover object-center rounded-[4px]"
        />
      </div>
      <h3 className="flex flex-1 text-[15px] text-center text-[#383D64] font-semibold leading-[1.3]">{data!.name}</h3>
      <div className="flex flex-col justify-end items-start w-full text-nowrap">
        <div className={`text-lg w-auto font-bold ${data.strike_price !== null && data.strike_price !== "" && data.strike_price > data.real_price ? "text-[#C6011B]" : "text-[#000]"}`}>
          {formatMoney(data.real_price, data.currency)}
        </div>
        {strikePrice}
      </div>
    </Link>
  );
};
