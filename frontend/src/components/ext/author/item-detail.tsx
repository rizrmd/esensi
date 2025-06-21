import type { FC, ReactNode } from "react";

interface Author {
  id: string;
  name: string;
  biography: string | null;
  social_media: string | null;
  avatar: string | null;
  id_account: string | null;
  id_user: string | null;
  cfg: any;
  auth_user?: any[];
  auth_account?: any;
  book?: any[];
  product?: any[];
}

const ItemDetail: FC<{
  label: string;
  value: string | number | ReactNode;
}> = ({ label, value }) => (
  <div className="mb-2 text-sm text-gray-600">
    {label}:&nbsp;
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

export const ItemDetails: FC<{
  list: Record<string, string | number | ReactNode>;
}> = ({ list }) =>
  Object.entries(list).map((val, index) => (
    <ItemDetail key={index} label={val[0]} value={val[1]} />
  ));

export const author = (author: Author | null) => {
  const detail = {
    Nama: author?.name,
    Email: author?.auth_user?.[0]?.email ?? "-",
    "Media Sosial": author?.social_media ? (
      <a
        href={author.social_media}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {author.social_media}
      </a>
    ) : (
      "-"
    ),
    "Jumlah Buku": author?.book?.length?.toString() ?? "0",
    "Jumlah Produk": author?.product?.length?.toString() ?? "0",
    Status: author?.auth_account ? "Terverifikasi" : "Belum Terverifikasi",
    "ID Account": author?.id_account ?? "-",
    "ID User": author?.id_user ?? "-",
    Biografi: author?.biography ? (
      <div
        className="font-medium text-gray-900 mt-2 p-3 border border-gray-100 rounded-md"
        dangerouslySetInnerHTML={{
          __html: author?.biography,
        }}
      />
    ) : (
      <span className="font-medium text-gray-900">-</span>
    ),
  };

  return detail;
};
