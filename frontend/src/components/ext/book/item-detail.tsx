import { formatCurrency } from "@/lib/utils";
import type { Book, Product } from "backend/api/types";
import type { FC, ReactNode } from "react";

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

export const book = (book: Book | null) => {
  const detail = {
    Nama: book?.name,
    Slug: book?.slug,
    Alias: book?.alias ?? "-",
    Harga: formatCurrency(book?.submitted_price, book?.currency),
    Status: book?.status,
    "Mata Uang": book?.currency,
    SKU: !book?.sku ? "-" : book?.sku,
    "Tanggal Terbit": book?.published_date
      ? new Date(book?.published_date).toLocaleDateString("id-ID")
      : "-",
    Fisik: book?.is_physical ? "Ya" : "Tidak",
    "Minimal Preorder": book?.preorder_min_qty ?? "-",
    "Tipe Konten": book?.content_type ?? "-",
    Deskripsi: book?.desc ? (
      <div
        className="font-medium text-gray-900 mt-2 p-3 border border-gray-100 rounded-md"
        dangerouslySetInnerHTML={{
          __html: book?.desc,
        }}
      />
    ) : (
      <span className="font-medium text-gray-900">-</span>
    ),
  };
  if (Object.keys(book?.info as Record<string, any>).length > 0) {
    detail["Info Tambahan"] = book?.info ? JSON.stringify(book?.info) : "-";
  }
  return detail;
};

export const product = (product: Product | null) => {
  const detail = {
    Nama: product?.name,
    Slug: product?.slug,
    Alias: product?.alias ?? "-",
    "Harga Coret": formatCurrency(product?.strike_price, product?.currency),
    Harga: formatCurrency(product?.real_price, product?.currency),
    Status: product?.status,
    "Mata Uang": product?.currency,
    SKU: !product?.sku ? "-" : product?.sku,
    "Tanggal Terbit": product?.published_date
      ? new Date(product?.published_date).toLocaleDateString("id-ID")
      : "-",
    Fisik: product?.is_physical ? "Ya" : "Tidak",
    "Minimal Preorder": product?.preorder_min_qty ?? "-",
    "Tipe Konten": product?.content_type ?? "-",
    Deskripsi: product?.desc ? (
      <div
        className="font-medium text-gray-900 mt-2 p-3 border border-gray-100 rounded-md"
        dangerouslySetInnerHTML={{
          __html: product?.desc,
        }}
      />
    ) : (
      <span className="font-medium text-gray-900">-</span>
    ),
  };
  if (Object.keys(product?.info as Record<string, any>).length > 0) {
    detail["Info Tambahan"] = product?.info
      ? JSON.stringify(product?.info)
      : "-";
  }
  return detail;
};
