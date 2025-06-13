import { CircleX } from "lucide-react";
import { Button } from "../ui/button";

export const FilterSelected = ({ label, action }) => {
  return (
    <Button
      variant="link"
      className="flex items-center justify-center gap-2 bg-[#EFEFEF] rounded-full px-4"
    >
      <CircleX
        stroke="#fffff"
        fill="#3030C1"
        strokeWidth={0}
        onClick={(e) => {
          e.preventDefault();
          action();
        }}
      />
      <span className="flex text-[#383D64]">{label}</span>
    </Button>
  );
};
