import { Alert } from "@/components/ui/global-alert";
import { baseUrl } from "@/lib/gen/base-url";
import type { OutputData } from "@editorjs/editorjs";
import type { User } from "backend/lib/better-auth";
import { type ClassValue, clsx } from "clsx";
import type { Decimal } from "shared/models/runtime/library";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRedirectURL(callbackURL: string | null) {
  return !callbackURL ? baseUrl.main_esensi : callbackURL;
}

export function isPublisher(user: User) {
  return !!user?.idPublisher;
}

export function isAuthor(user: User) {
  return !!user?.idAuthor;
}

export function snakeToCamel(str: string): string {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
}

export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDateObject(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatCurrency(
  amount?: number | Decimal | null,
  currency?: string
) {
  if (currency === "Rp.") currency = "IDR";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency || "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

export function getMimeType(ext: string | undefined) {
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    case "avif":
      return "image/avif";
    case "tiff":
    case "tif":
      return "image/tiff";
    case "bmp":
      return "image/bmp";
    case "ico":
      return "image/x-icon";
    case "heif":
    case "heic":
      return "image/heif";
    case "apng":
      return "image/apng";
    default:
      return "application/octet-stream";
  }
}

export function isTwoFileTheSame(
  file1: File | null,
  file2: File | null
): boolean {
  if (!file1 || !file2) return false;
  if (file1.size !== file2.size) return false;
  if (file1.type !== file2.type) return false;
  if (file1.name !== file2.name) return false;
  return true;
}

export function isTwoFilesArrayTheSame(
  files1: File[] | null,
  files2: File[] | null
): boolean {
  if (!files1 || !files2) return false;
  if (files1.length !== files2.length) return false;
  for (let i = 0; i < files1.length; i++) {
    if (!isTwoFileTheSame(files1[i], files2[i])) return false;
  }
  return true;
}

export const getImageUrl = (url: string, width?: number, height?: number) => {
  if (!url) return "";
  const params = new URLSearchParams();
  if (width) params.append("w", width.toString());
  if (height) params.append("h", height.toString());
  return `${url}?${params.toString()}`;
};

export enum ItemLayoutEnum {
  GRID = "grid",
  LIST = "list",
  COMPACT = "compact",
}

export type BookStep = {
  step: number;
  title: string;
  description: string;
  link: string;
};

export function validate(
  failCondition: boolean,
  local: { error: string; render: () => void },
  message: string
): any {
  if (failCondition) {
    Alert.info(message);
    local.error = message;
    local.render();
    return true;
  }
  return false;
}

export function validateBatch(
  local: { error: string; render: () => void },
  options: {
    failCondition: boolean;
    message: string;
  }[]
) {
  for (const option of options) {
    if (validate(option.failCondition, local, option.message)) {
      return true;
    }
  }
  return false;
}

export function isValidEditorData(data: any): data is OutputData {
  // Basic validation
  if (!data || typeof data !== "object") return false;
  if (!Array.isArray(data.blocks)) return false;

  // Check each block has required properties
  return data.blocks.every((block: any) => {
    return (
      typeof block === "object" &&
      typeof block.type === "string" &&
      block.data !== undefined
    );
  });
}
