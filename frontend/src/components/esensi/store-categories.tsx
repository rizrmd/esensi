import { Link } from "@/lib/router";

export const StoreCategories = () => {
  const data = [
    { label: "Putu Resi Lestari", slug: "putu-resi-l",},
    { label: "Parenting", slug: "parenting",},
    { label: "Mental Health", slug: "mental-health",},
    { label: "Meraih Ilmu Semesta", slug: "meraih-ilmu-semesta",},
    { label: "Islam", slug: "islam",},
    { label: "Pintu Musahabah", slug: "pintu-musahabah",},
    { label: "NLP", slug: "neuro-linguistic-programming",},
    { label: "Afif Aulia Nurani", slug: "afif-auliya-n",},
    { label: "Keuangan", slug: "keuangan",},
    { label: "Kesehatan", slug: "kesehatan",},
    { label: "Tim Esensi Online", slug: "tim-esensi-online",},
  ];

  const category_list = data.map((cat, idx) => {
    return (
      <Link href={`/category/${cat.slug}`} key={`home_categories_${idx}`}>{cat.label}</Link>
    );
  });

  return (
    <div className="flex w-full overflow-x-auto border-b-[1px] border-b-[color:#D3d3d3]">
      <div className="flex flex-nowrap flex-row items-center gap-6 px-6 max-w-max h-15 text-nowrap">
        {category_list}
      </div>
    </div>
  );
}
