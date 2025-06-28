import { MainEsensiLayout } from "@/components/esensi/layout";
import type { api } from "@/lib/gen/main.esensi";

export default (data: Awaited<ReturnType<typeof api.howtobuy>>["data"]) => {
  const header_config = {
    enable: true,
    logo: true,
    back: true,
    search: true,
    title: null,
    cart: true,
    profile: true,
  };

  const local = {
    content: data.content,
  };

  return (
    <MainEsensiLayout header_config={header_config} mobile_menu={true}>
      <div className="flex flex-col justify-start items-center w-full">
        <div className="flex flex-col lg:flex-row w-full py-6 px-6 max-w-[1200px] ">
          <div
            className="whitespace-pre-line [&_h3]:text-2xl [&_h3]:mb-8 [&_h3]:text-center gap-4"
            dangerouslySetInnerHTML={{ __html: local.content }}
          ></div>
        </div>
      </div>
    </MainEsensiLayout>
  );
};
