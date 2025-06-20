import { Link } from "@/lib/router";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export const SectionTitle = ({ title, url, btn_label = "View All" }) => {
  return (
    <div className="flex flex-row justify-between items-center w-full gap-6 px-6 whitespace-nowrap">
      <div className="flex flex-col justify-center items-start w-auto">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <hr className="w-full h-[1px] bg-gray-500" />
      <div className="flex flex-row justify-end items-center">
        <Button variant="outline" asChild>
          <Link
            href={url}
            className="flex flex-row justify-between items-center gap-2"
          >
            <span>{btn_label}</span>
            <ArrowRight size={28} />
          </Link>
        </Button>
      </div>
    </div>
  );
};
