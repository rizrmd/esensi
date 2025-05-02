import { PageFooter } from "@/components/esensi/page-footer";
import { PageHeader } from "@/components/esensi/page-header";

export default () => {
  return (
    <div className="flex flex-1 flex-col gap-0 w-screen h-screen fixed p-0 m-0 overflow-hidden text-[color:#020817]">
      <PageHeader title={"Esensi"} />
      <div className="flex flex-1 min-h-0 justify-center items-start overflow-y-auto relative">
        <div className="w-full flex flex-col justify-center gap-10 px-14">
          isi konten
        </div>
      </div>
      <PageFooter />
    </div>
  );
};
