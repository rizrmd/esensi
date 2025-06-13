import { useParams } from "@/lib/hooks/use-router";
import { MainEsensiLayout } from "@/components/esensi/layout";
import { useLocal } from "@/lib/hooks/use-local";
import { api } from "@/lib/gen/main.esensi";
import { BookDetail } from "@/components/esensi/book-detail";

export default () => {
  const { params } = useParams();
  const local = useLocal(
    {
      loading: false,
      data: {} as any,
    },
    async () => {
      const res = await api.product();
      local.data = res.data.product;
      console.log(local.data);
      local.render();
    },
  );

  return (
    <MainEsensiLayout title={`Produk Details`}>
      <div className="w-full flex flex-col justify-center gap-10">
        <div className="w-full flex flex-col justify-center gap-10 md:gap-20 lg:px-16 lg:pb-8">
          <BookDetail loading={local.loading} data={local.data} />
        </div>
      </div>
    </MainEsensiLayout>
  );
};
