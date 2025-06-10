import { Link } from "@/lib/router";
import { StoreBundlingCard } from "./store-bundling-card";
import { Button } from "../ui/button";
import { CircleArrowRight, Ghost } from "lucide-react";

export const StoreBundling = ({ slug, img, list }) => {
  const renderBooks = list.map((book, idx) => {
    return (
      <StoreBundlingCard data={book} key={`esensi_store_bundlinglist_${idx}`} />
    );
  });

  return (
    <div className="flex flex-row w-full px-6 gap-5 items-stretch">
      <div className="flex w-1/4 flex-row shrink-0">
        <Link href={`/bundle/${slug}`}>
          <img
            src={img}
            alt="Special bundle"
            className="w-full h-auto aspect-1/1 object-fill position-center rounded-sm"
          />
        </Link>
      </div>

      <div className="flex w-auto grow-0 flex-row relative overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-auto gap-4 [&>a]:w-[auto]">{renderBooks}</div>
      </div>
      <div className="flex w-auto justify-center items-center">
          <Link
            href={`/bundle/${slug}`}
            className="flex text-[#383D64]"
          >
            <CircleArrowRight size={50}  strokeWidth={1.5} />
          </Link>
      </div>
    </div>
  );
};
