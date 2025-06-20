export const DiscountPercent = ({
  real_price = 0 as number | null,
  strike_price = null as number | null,
  className = null as string |null,
}) => {
  real_price = real_price !== null ? real_price : 0;
  strike_price =
    strike_price !== null && strike_price !== 0 && strike_price > real_price
      ? strike_price
      : real_price;

  const discval =
    "-" + Math.round(((strike_price - real_price) / strike_price) * 100) + "%";

  return (
    <div className={`flex justify-center items-center bg-[#d0011b] text-[color:#fff] leading-0 font-bold rounded-full w-auto h-1 ${className !== null ? className : "text-[10px] py-2.5 px-2"}`}>
      {discval}
    </div>
  );
};
