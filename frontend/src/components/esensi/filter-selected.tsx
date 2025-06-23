import { Button } from "../ui/button";

export const FilterSelected = ({ name, label, value, action }) => {
  return (
    <label
      className={`flex items-center justify-center gap-2 rounded-full px-4 border cursor-pointer hover:no-underline transition-colors bg-[#BFCDF0] border-transparent hover:border-[#3030C1]}`}
      onClick={(e) => {
        e.preventDefault();
        action(name, value);
      }}
    >
      {label}
    </label>
  );
};
