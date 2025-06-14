import { MainEsensiLayout } from "@/components/esensi/layout";
import { useLocal } from "@/lib/hooks/use-local";

export default () => {
  const header_config = {
    enable: true,
    logo: false,
    back: true,
    search: false,
    title: "Detail buku",
    cart: true,
    profile: true,
  };
  const local = useLocal({}, async () => {});
  return (
    <MainEsensiLayout header_config={header_config}>
      <div className="flex flex-col items-center">
        <div className="flex">foto</div>
        <div className="flex">title</div>
        <div className="flex">cats</div>
        <div className="flex">price</div>
        <div className="flex">info</div>
        <div className="flex">desc</div>
        <div className="flex">related</div>
      </div>
    </MainEsensiLayout>
  );
};
