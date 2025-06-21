import { ItemLayoutEnum } from "@/lib/utils";
import type { FC } from "react";

const Grid: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="mb-1 text-sm text-gray-600">
    {label}:&nbsp;<span className="font-medium text-gray-900">{value}</span>
  </div>
);

const List: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="text-sm text-gray-600">
    {label}:&nbsp;<span className="font-medium text-gray-900">{value}</span>
  </div>
);

const Compact: FC<{ value: string }> = ({ value }) => (
  <td className="p-2 text-sm">{value}</td>
);

export const Item: FC<{
  type: ItemLayoutEnum;
  item: Record<string, string>;
}> = ({ type, item }) =>
  Object.entries(item).map(([label, value]) =>
    type === ItemLayoutEnum.GRID ? (
      <Grid key={label} label={label} value={value} />
    ) : type === ItemLayoutEnum.LIST ? (
      <List key={label} label={label} value={value} />
    ) : (
      <Compact key={label} value={value} />
    )
  );

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

export function author(author: Author): Record<string, string> {
  return {
    Email: author.auth_user?.[0]?.email ?? "-",
    "Jumlah Buku": author.book?.length?.toString() ?? "0",
    "Jumlah Produk": author.product?.length?.toString() ?? "0",
    Status: author.auth_account ? "Terverifikasi" : "Belum Terverifikasi",
  };
}
