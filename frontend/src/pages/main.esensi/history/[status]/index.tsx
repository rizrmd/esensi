import { Breadcrumbs } from "@/components/esensi/breadcrumbs";
import { MainEsensiLayout } from "@/components/esensi/layout";
import { PaginationNumber } from "@/components/esensi/pagination-number";
import { TrxCard } from "@/components/esensi/trx-card";
import { TrxHelpLinks } from "@/components/esensi/trx-help-links";
import { api } from "@/lib/gen/main.esensi";
import { useLocal } from "@/lib/hooks/use-local";

export default (data: Awaited<ReturnType<typeof api.history>>["data"]) => {
  const header_config = {
    enable: true,
    logo: true,
    back: false,
    search: true,
    title: null,
    cart: true,
    profile: true,
  };

  const local = {
    title: "" as string,
    loading: true as boolean,
    list: [] as any,
    pagination: {
      items: 20 as number,
      page: 1 as number,
      total_pages: 1 as number,
      url: {
        prefix: "" as string,
        suffix: "" as string,
      },
    } as any,
    breadcrumb: [] as any,
    isBundle: false as boolean,
  };

  if (data?.list) {
    local.list = data.list;
    local.pagination = data.pagination;
    local.breadcrumb = data.breadcrumb;
    local.title = `Dunia Baru Dimulai dari Satu Halaman${
      data.pagination.page > 1 ? ` | Page #${data.pagination.page}` : ""
    }`;
    local.loading = false;
  }

  const renderList = local.list.map((trx, idx) => {
    return (
      <div className="flex w-full" key={`esensi_trx_${idx}`}>
        <TrxCard data={trx} />
      </div>
    );
  });

  const renderPagination = (
    <>
      <PaginationNumber url={undefined} />
    </>
  );

  const renderPage = (
    <MainEsensiLayout header_config={header_config}>
      <div className="flex flex-col items-center bg-[#E1E5EF] lg:pb-10">
        <div className="hidden lg:flex w-full max-w-[1200px] lg:py-10">
          <Breadcrumbs data={local.breadcrumb} />
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 lg:gap-10 w-full max-w-[1200px]">
          <div className="flex flex-col gap-6 pt-6 lg:pt-0">
            <div className="flex flex-col gap-3">{renderList}</div>
            {renderPagination}
          </div>
          <div className="flex flex-col bg-white gap-4 w-full h-auto lg:w-1/3 p-6">
            <TrxHelpLinks />
          </div>
        </div>
      </div>
    </MainEsensiLayout>
  );

  return <>{!local.loading && renderPage}</>;
};
