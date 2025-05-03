import { useLocal } from "@/lib/hooks/use-local";
import { BookCard } from "@/components/esensi/book-card";
import { api } from "@/lib/gen/main.esensi";
import { MainEsensiLayout } from "@/components/app/main-esensi-layout";

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
    <MainEsensiLayout title="Semua buku" showLogo={false}>
      <div className="w-full flex flex-col justify-center gap-10 lg:px-16 lg:py-8">
        <div className="flex flex-row justify-center items-stretch flex-wrap">
          {local.content}
        </div>
      </div>
    </MainEsensiLayout>
  );
};
