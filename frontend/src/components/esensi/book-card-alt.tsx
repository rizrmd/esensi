import { Link } from "@/lib/router";
import { formatMoney } from "./format-money";

export const BookCardAlt = ({ data }) => {
  let strikePrice: any;
  if (
    data.strike_price !== null &&
    data.strike_price !== "" &&
    data.strike_price > data.real_price
  ) {
    strikePrice = (
      <div className="w-auto line-through">
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
        <img
          src={`https://esensi.online/${data.cover.replace("_file/", "_img/")}?w=320`}
          alt={data!.name.replace("'", "").replace('"', "")}
          className="w-full h-auto aspect-3/4 object-cover object-center rounded-[4px]"
        />
      </div>
      <h3 className="flex flex-1 text-[15px] text-left text-[#383D64] font-semibold leading-[1.3]">{data!.name}</h3>
      <div className="flex flex-col justify-start items-start w-full text-nowrap">
        {strikePrice}
        <div className="w-auto font-bold text-black text-lg">
          {formatMoney(data.real_price, data.currency)}
        </div>
      </div>
    </Link>
  );
};
