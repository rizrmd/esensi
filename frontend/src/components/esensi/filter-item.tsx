import { Button } from "../ui/button";

export const FilterItem = ({ name, label, value, action, selected }) => {
  return (
    <Button
      variant="link"
      className={`flex items-center justify-center gap-2 rounded-full px-4 border cursor-pointer hover:no-underline transition-colors ${selected == value ? "bg-[#3030C1] border-[#3030C1] text-white" : "bg-[#BFCDF0] border-transparent hover:border-[#3030C1]"}`}
      onClick={(e) => {
        e.preventDefault();
        action(name, value);
      }}
    >
      {label}
    </Button>
  );
};
