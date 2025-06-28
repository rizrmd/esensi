import { Link } from "@/lib/router";
import { formatMoney } from "./format-money";
import { DiscountPercent } from "./discount-percent";
import { ImgThumb } from "./img-thumb";

export const BookCard = ({ data }) => {
  let strikePrice: any;
  if (
    data.strike_price !== null &&
    data.strike_price !== "" &&
    data.strike_price > data.real_price
  ) {
    strikePrice = formatMoney(data.strike_price, data.currency);
  }

  const discount = <DiscountPercent real_price={data?.real_price} strike_price={data?.strike_price} onlyPercent={true} />

  return (
    <Link
      href={`/product/${data.slug}`}
      className="flex flex-col justify-center items-center gap-3 py-4 px-2 lg:px-4 relative cursor-pointer box-border w-full"
    >
      <div className="relative w-full h-auto overflow-visible">
        <div className="absolute top-0 left-0 z-10">{discount}</div>
        <ImgThumb src={data.cover} alt={data?.name} className="w-full h-auto aspect-3/4 object-cover object-center rounded-[4px]" width={320}/>
      </div>
      <h3 className="flex flex-1 text-[15px] text-center text-[#383D64] font-semibold leading-[1.3]">{data!.name}</h3>
      <div className="flex flex-col justify-end items-start w-full text-nowrap">
      <div className="w-full line-through text-[#a9a9a9] text-xs h-4">
        {strikePrice}
        </div>
        <div className={`text-lg w-auto font-bold ${data.strike_price !== null && data.strike_price !== "" && data.strike_price > data.real_price ? "text-[#C6011B]" : "text-[#000]"}`}>
          {formatMoney(data.real_price, data.currency)}
        </div>
      </div>
    </Link>
  );
};
