import { PageFooter } from "@/components/esensi/page-footer";
import { PageHeader } from "@/components/esensi/page-header";
import { useLocal } from "@/lib/hooks/use-local";
import { BookCard } from "@/components/esensi/book-card";
import { api } from "@/lib/gen/main.esensi";

export default () => {
  const local = useLocal(
    {
      loading: true,
      data: [] as any[],
      content: null as any,
    },
    async () => {
      const res = await api.store();
      local.data = res.allbooks;
      if (local.data.length > 0) {
        local.content = local.data.map((book, idx) => {
          return <BookCard data={book} key={`all_books_${idx}`} />;
        });
      }
      local.loading = false;
      local.render();
    },
  );

  return (
    <div className="flex flex-1 flex-col gap-0 w-screen h-screen fixed p-0 m-0 overflow-hidden text-[color:#020817]">
      <PageHeader title="Semua buku" logo={false} />
      <div className="flex flex-1 min-h-0 justify-center items-start overflow-y-auto relative">
        <div className="w-full flex flex-col justify-center gap-10 lg:px-16 lg:py-8">
          <div className="flex flex-row justify-center items-stretch flex-wrap">
            {local.content}
          </div>
        </div>
      </div>
      <PageFooter />
    </div>
  );
};
