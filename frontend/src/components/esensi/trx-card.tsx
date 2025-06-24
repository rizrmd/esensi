import { useLocal } from "@/lib/hooks/use-local";
import { Button } from "../ui/button";
import { formatMoney } from "./format-money";
import { formatDate } from "@/lib/utils";
import { Link } from "@/lib/router";

export const TrxCard = ({ data = null as any | null }) => {
  const local = useLocal(
    {
      toggleMore: false as boolean,
    },
    async () => {}
  );
  const toggleMore = (e: any) => {
    e.preventDefault();
    local.toggleMore = !local.toggleMore;
    local.render();
  };

  const productList = data.info?.cart.map((book, idx) => {
    let count = 0;
    let mainproduct;
    const strikePrice = book?.strike_price && book?.strike_price !== null && (
      <span>{formatMoney(book.strike_price, book.currency)}</span>
    );
    if (idx > 0) {
      count++;
      <div className="flex gap-2 px-2">
        <div className="flex shrink-0 w-1/4 lg:max-w-[80px] p-2 items-center">
          <img
            src={`https://esensi.online/${book.cover.replace(
              "_file/",
              "_img/"
            )}?w=320`}
            alt={`book_${idx}`}
            className="w-full h-auto aspect-3/4 object-center object-cover"
          />
        </div>
        <div className="flex flex-col grow-1 p-1 gap-1">
          <div className="text-left text-[#3B2C93] font-semibold leading-[1.2] lg:max-w-[60%]">
            {book.name}
          </div>
          <div className="flex flex-col w-full justify-start items-end text-xs">
            {strikePrice}
            <span className="text-[#B0B0B0]">{formatMoney(book.real_price, book.currency)}</span>
          </div>
        </div>
      </div>;
    } else {
      mainproduct = (
        <div className="flex gap-2 px-2">
          <div className="flex shrink-0 w-1/4 lg:max-w-[80px] p-2 items-center">
            <img
              src={`https://esensi.online/${book.cover.replace(
                "_file/",
                "_img/"
              )}?w=320`}
              alt={`book_${idx}`}
              className="w-full h-auto aspect-3/4 object-center object-cover"
            />
          </div>
          <div className="flex flex-col grow-1 p-1 gap-1">
            <div className="text-left text-[#3B2C93] font-semibold leading-[1.2] lg:max-w-[60%]">
              {book.name}
            </div>
            <div className="flex flex-col w-full justify-start items-end text-xs">
              {strikePrice}
              <span className="text-[#B0B0B0]">{formatMoney(book.real_price, book.currency)}</span>
            </div>
          </div>
        </div>
      );
    }

    const moreproduct = count > 0 && (
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col"></div>
        <div className="flex w-full border-t">
          <Button
            variant="ghost"
            className="py-1 px-2 w-full h-auto cursor-pointer"
            onClick={toggleMore}
          >
            View all
          </Button>
        </div>
      </div>
    );

    return (
      <div className="flex flex-col w-full" key={`esensi_trx_products_${idx}`}>
        {mainproduct}
        {moreproduct}
      </div>
    );
  });

  const renderCard = (
    <Link href={`/trx/${data.id}`} className="flex flex-col w-full bg-white">
      <div className="flex w-full justify-between items-center py-1 gap-2 px-3 border-b [&_.trx-status-paid]:bg-[#3B2C93] [&_.trx-status-paid]:text-white [&_.trx-status-pending]:bg-[#E1E5EF] [&_.trx-status-cancelled]:bg-[#C6011B] [&_.trx-status-cancelled]:text-white ">
        <div><span className="text-xs">{data.id}</span></div>
        <div><strong className={`trx-status-${data.status} text-xs py-1 px-2 rounded-sm capitalize`}>{data.status}</strong></div>
      </div>

      <div className="flex">{productList}</div>

      <div className="flex w-full justify-between items-center border-t py-2.5 px-3 gap-2">
        <span className="text-xs text-[#B0B0B0] grow-1">{formatDate(data.created_at)}</span>
        <strong className="text-[#3B2C93] shrink-0">
          {formatMoney(data.total, data.currency)}
        </strong>
        <span className="shrink-0 h-auto">»</span>
      </div>
    </Link>
  );

  return <>{renderCard}</>;
};
