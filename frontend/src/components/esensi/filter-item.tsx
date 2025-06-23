import { useLocal } from "@/lib/hooks/use-local";

export const FilterItem = ({ pid, label, value, action, selected }) => {
  const local = useLocal(
    {
      checked: false as boolean,
    },
    async () => {
      local.checked = selected;
      local.render();
    }
  );
  return (
    <label
      className={`flex items-center justify-center gap-2 text-sm h-7 rounded-full select-none px-4 border cursor-pointer hover:no-underline transition-colors ${
        selected
          ? "bg-[#3030C1] border-[#3030C1] text-white"
          : "bg-[#BFCDF0] border-transparent hover:border-[#3030C1]"
      } lg:bg-transparent lg:text-inherit lg:border-none lg:h-auto lg:px-0`}
    >
      <input
        type="checkbox"
        className="hidden lg:flex"
        checked={selected}
        onChange={() => {
          action(pid, value);
        }}
      />
      <span>{label}</span>
    </label>
  );
};
