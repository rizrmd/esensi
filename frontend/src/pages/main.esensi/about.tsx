import { Breadcrumbs } from "@/components/esensi/breadcrumbs";
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

  const local = useLocal(
    {
      loading: true as boolean,
      breadcrumb: [] as any,
      content:
        `<h3></h3><p>In every mind there exists an Ocean Door, a hidden gateway to one’s subconscious, a realm of possibility and manipulation. And there are only two telepaths in the world who have power over it.

A young telepath named Kallista wakes up in a beautiful, secluded valley called the Vale with no memories of her early life. For the next decade, she trains as a soldier for the Vow, an enigmatic military organisation led by a legendary telepathic warrior, Valeria Reed. Years after a childhood escape attempt that ended as a miserable failure, Kallista resolves to try one last time.</p>` as string,
      terbitan: null as any,
      links: [
        {
          label: "Email kami",
          sublabel: "info@esensi.online",
          url: "mailto:info@esensi.online",
          newTab: true,
          icon: <Mail />,
        },
        {
          label: "Telepon kami",
          sublabel: `(031) 000 000
          Jam Operasional 08:00 - 20:00 WIB`,
          url: "#",
          newTab: true,
          icon: <Phone />,
        },
        {
          label: "Customer support",
          url: "#",
          newTab: true,
          icon: <MessageCircleMore />,
        },
        {
          label: "Pusat bantuan",
          url: "#",
          newTab: true,
          icon: <FileSearch />,
        },
      ] as any[],
    },
    async () => {
      local.breadcrumb = data.breadcrumb;
      local.loading = false;
      local.render();
    }
  );

  const renderLoading = <></>;
  const renderLogo = (
    <p className="flex justify-center w-full pb-6">
      <img
        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOUKb6M5yGcRNhuM1NHSBaAvbNYSFAibMX-1xCI8gI8jl-h566LB-SNs4PW7s2hyphenhyphenj9WNdyhCtn8LFqX9V2j-ABFZoN-nw34q0l4Hf3a13EMffqv6edTQAzK7O-8RXpOIA69rTg6g60hv0eME6yDgJpUZEFIastMfEW-6Pjpq6LFXoGdKExm7L-Hu9PYy8/s1600/esensi-online-logo.png"
        alt="Esensi Online"
        className="w-1/2 h-auto"
      />
    </p>
  );
  const renderContent = (
    <div className="flex flex-col w-full gap-4">
      <h3 className="lg:text-3xl">Tentang Kami</h3>
      <div
        className="whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: local.content }}
      ></div>
    </div>
  );
  const renderTerbitan = (
    <div className="flex flex-col w-full gap-4">
      <h3>Buku Terbitan Esensi Online</h3>
      <div className="flex"></div>
    </div>
  );
  const renderLinksItem = local.links.map((item) => {
    return (
      <LinkItem
        label={item.label}
        sublabel={item?.sublabel !== "undefined" ? item.sublabel : null}
        url={item.url}
        newTab={item.newTab}
        icon={
          item?.icon !== "undefined" && item?.icon !== null ? item.icon : null
        }
      ></LinkItem>
    );
  });
  const renderLinks = (
    <div className="flex flex-col w-full gap-4">
      <h3>Hubungi Kami</h3>
      <div className="flex flex-col">{renderLinksItem}</div>
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
