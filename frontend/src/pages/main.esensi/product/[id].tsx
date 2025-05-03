import { useParams } from "@/lib/hooks/use-router";
import { MainEsensiLayout } from "@/components/app/main-esensi-layout";

export default () => {
  const { params } = useParams();
  
  return (
    <MainEsensiLayout title={`Produk ${params.id}`}>
      <div className="w-full flex flex-col justify-center gap-10 px-14">
        {params.id}
      </div>
    </MainEsensiLayout>
  );
};