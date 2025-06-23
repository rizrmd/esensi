import { Link } from "@/lib/router";

export const Breadcrumbs = ({ data = [] as any[] }) => {
  const last = data.length - 1;
  const list = data.map((li, idx) => {
    const arrow = idx < last ? <>/</> : <></>;
    return (
      <>
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
          key={`esensi_breadcrumb_${idx}`}
        >
          {li?.url == null ? (
            <span itemProp="name">{li?.label}</span>
          ) : (
            <Link itemProp="item" href={li?.url}>
              <span itemProp="name">{li?.label}</span>
            </Link>
          )}
        </li>
        {arrow}
      </>
    );
  });

  const doRender = data.length > 0 && (
    <ol
      itemScope
      itemType="https://schema.org/BreadcrumbList"
      className="flex w-full items-center gap-2 [&_a]:text-[#5965D2] text-md [&_a]:font-semibold"
    >
      <li>
        <Link href="/">
          <span>Beranda</span>
        </Link>
      </li>
      /
      {list}
    </ol>
  );

  return <>{doRender}</>;
};
