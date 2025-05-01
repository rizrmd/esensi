import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { baseUrl } from "@/lib/gen/base-url";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRedirectURL(callbackURL: string | null) {
  return !callbackURL ? baseUrl.main_esensi : callbackURL;
}
