import { Link } from "@/lib/router";

export const CategoryList = ({
  data = [] as any[] | null,
  id = null as any | null,
  className = null as any | null,
}) => {
  if (id == null || id == "") {
    const n = Math.floor(Math.random() * 11);
    const k = Math.floor(Math.random() * 1000000);
    id = String.fromCharCode(n) + k;
  }

  const cats = data?.map((cat, idx) => {
    return (
      <Link
        href={`/category/${cat?.slug}`}
        key={`esensi_cat_${id}_${cat?.slug}_${idx}`}
        className="flex px-2 py-1"
      >
        {cat?.name}
      </Link>
    );
  });


  const renderCategories = data && data.length > 0 && (
    <div className={`flex flex-col w-full items-start gap-3 ${className !== null ? className : ""}`}>
      <h4 className="text-[#383D6480] text-xs font-bold hidden lg:flex">Kategori:</h4>
      <div className="flex flex-wrap justify-start items-center gap-2 [&>a]:bg-[#E1E5EF] [&>a]:text-[#383D64] [&>a]:rounded-full [&>a]:px-2 [&>a]:text-[11px]">{cats}</div>
    </div>
  );

  return <>{renderCategories}</>;
};
