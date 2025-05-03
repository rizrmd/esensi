import { Link } from "@/lib/router";
import type { FC } from "react";

export type StoreCategoryItem = {
  name: string;
  slug: string;
};

export const StoreCategories: FC<{
  loading: boolean;
  list: StoreCategoryItem[];
}> = ({ loading, list }) => {
  const category_list = list.map((cat, idx) => {
    return (
      <Link href={`/category/${cat.slug}`} key={`home_categories_${idx}`}>
        {cat.name}
      </Link>
    );
  });

  return (
    <div className="flex md:hidden w-full overflow-x-auto border-b-[1px] border-b-[color:#D3d3d3]">
      <div className="flex flex-nowrap flex-row items-center gap-6 px-6 max-w-max h-15 text-nowrap">
        {loading ? "Loading..." : category_list}
      </div>
    </div>
  );
};
