import { Link } from "@/lib/router";
import { formatMoney } from "./format-money";

export const BookCardAlt = ( {data} ) => {
  let discount:any, strikePrice:any;
  if (data.strike_price !== null && data.strike_price !== "" && data.strike_price > data.real_price) {
    const discval = "-" + Math.round((data.strike_price - data.real_price) / data.strike_price * 100) + "%";
    discount = <div className="flex justify-center items-center bg-[#d0011b] text-[color:#fff] text-[size:11px] px-1 py-[.1em] rounded-[3px] w-auto absolute top-1 left-1 z-10">{discval}</div>
    strikePrice = <div className="w-auto line-through text-[10px] text-[#a9a9a9]">{formatMoney(data.strike_price, data.currency)}</div>
  }

	return(
		<Link href={`/product/${data.slug}`} className="flex flex-col justify-center items-start w-28 gap-2 relative cursor-pointer">
		<div className="relative w-auto overflow-visible">
		{discount}
		<img src={`https://esensi.online/${data.cover.replace("_file/","_img/")}?w=200`} alt={data.name.replace("'","").replace('"','')} className="aspect-3/4 object-cover object-center rounded-[4px]" />
		</div>
		<h3 className="flex flex-1 text-[11px] text-center text-wrap leading-[1.25]">{data.name}</h3>
		<div className="flex flex-col w-full justify-center items-center gap-1">
			{strikePrice}
			<div className="w-auto text-[color:#d0011b] font-bold text-[11px]">{formatMoney(data.real_price
			, data.currency)}</div>
		</div>
		</Link>
	);
}
