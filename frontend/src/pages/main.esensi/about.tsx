import { Breadcrumbs } from "@/components/esensi/breadcrumbs";
import { ImgThumb } from "@/components/esensi/img-thumb";
import { MainEsensiLayout } from "@/components/esensi/layout";
import { LinkItem } from "@/components/esensi/link-item";
import type { api } from "@/lib/gen/main.esensi";
import { useLocal } from "@/lib/hooks/use-local";
import type { NullSyncSubprocess } from "bun";
import { FileSearch, Mail, MessageCircleMore, Phone } from "lucide-react";

export default (data: Awaited<ReturnType<typeof api.about>>["data"]) => {
  const header_config = {
    enable: true,
    logo: false,
    back: true,
    search: false,
    title: "Tentang Kami",
    profile: false,
  };

  const icons = {
    mail: <Mail />,
    phone: <Phone />,
    chat: <MessageCircleMore />,
    file: <FileSearch />,
  };

  const local = {
    loading: true as boolean,
    logo: {} as any,
    breadcrumb: [] as any,
    content: "" as string,
    terbitan: null as any,
    links: [
      {
        label: "Email kami",
        sublabel: "info@esensi.online",
        url: "mailto:info@esensi.online",
        newTab: true,
        icon: "mail",
      },
    ] as any,
  };

  if (data) {
    local.logo = data?.logo;
    local.breadcrumb = data?.breadcrumb;
    local.content = data?.content;
    local.links = data?.links;
    local.loading = false;
  }

  const renderLoading = <></>;
  const renderLogo = (
    <p className="flex justify-center w-full pb-6">
      <ImgThumb
        src={local.logo?.img}
        alt={local.logo?.alt}
        className="w-1/2 h-auto"
        skipResize={true}
      />
    </p>
  );
  const renderContent = (
    <div className="flex flex-col w-full gap-4">
      <div
        className="whitespace-pre-line [&_h3]:text-2xl [&_h3]:mb-8 [&_h3]:text-center gap-4"
        dangerouslySetInnerHTML={{ __html: local.content }}
      ></div>
    </div>
  );
  const renderTerbitan = (
    <div className="hidden flex-col w-full gap-4">
      <h3>Buku Terbitan Esensi Online</h3>
      <div className="flex"></div>
    </div>
  );
  console.log(local.links);
  const renderLinksItem = local.links !== "undefined" && local.links !== undefined &&
    local.links !== null &&
    local.links.length > 0 &&
    local.links.map((item: any, idx) => {
      const renderItems = !item || item === "undefined" ? <></> : <LinkItem
          key={`esensi_about_links_${idx}`}
          label={item?.label}
          sublabel={item?.sublabel !== "undefined" ? item.sublabel : null}
          url={item?.url}
          newTab={item?.newTab}
          icon={
            item?.icon !== "undefined" && item?.icon !== null
              ? icons[item.icon]
              : null
          }
        />;
      return renderItems;
    });
  const renderLinks = (
    <div className="flex flex-col w-full gap-4">
      <h3>Hubungi Kami</h3>
      <div className="flex flex-col">
        {local.links !== "undefined" && local.links !== undefined &&
    local.links !== null &&
    local.links.length > 0 && renderLinksItem}
      </div>
    </div>
  );

  return (
    <MainEsensiLayout header_config={header_config} mobile_menu={true}>
      <div className="flex flex-col justify-start items-center w-full">
        <div className="flex flex-col lg:flex-row w-full py-6 px-6 max-w-[1200px] ">
          <div className="flex w-full lg:w-2/5 shrink-0 flex-col justify-start items-center">
            {!local.loading && renderLogo}
          </div>
          <div className="flex lg:grow-1 w-full flex-col justify-start items-center gap-6 [&_h3]:font-bold [&_h3]:text-[#3B2C93] [&>div:not(:last-child)]:border-b [&>div:not(:last-child)]:border-b-[#E1E5EF] [&>div:not(:last-child)]:pb-4">
            {!local.loading && renderContent}
            {!local.loading && renderTerbitan}
            {!local.loading && renderLinks}
          </div>
        </div>
      </div>
    </MainEsensiLayout>
  );
};
