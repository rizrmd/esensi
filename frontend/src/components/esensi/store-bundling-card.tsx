import { Link } from "@/lib/router";
import { formatMoney } from "./format-money";
import { Star } from "lucide-react";

export const StoreBundlingCard = ({ data }) => {

    const stars = Array.from({ length: 5 }, (_, idx) => {
        return <Star size={13} fill="currentColor" strokeWidth={0} />;
    })
  return (
    <Link href={`/product/${data.slug}`} className="flex h-full w-auto aspect-3/2">   
      <div className="flex w-auto aspect-3/4">
        <img
          src={`https://esensi.online/${data.cover.replace(
            "_file/",
            "_img/"
          )}?w=320`}
          alt={data!.name.replace("'", "").replace('"', "")}
          className="w-full h-auto aspect-1/2 object-cover object-center rounded-[4px]"
        />
      </div>
      <div className="flex flex-col justify-center items-start w-auto aspect-3/4 py-4 px-6 text-left text-[#383D64] gap-2">
        <span className="text-xs">Author</span>
        <h3 className="font-bold leading-[1.2]">{data.name}</h3>
        <div className="flex items-center text-[#FFC540] mt-2">{stars} <span className="text-[#383D64] ml-2 text-[13px]">5</span></div>
        <div className="text-xl text-[#E3330A] font-bold">{formatMoney(data.real_price, data.currency)}</div>
      </div>
    </Link>
  );
};
