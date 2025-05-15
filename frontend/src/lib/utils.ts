import { baseUrl } from "@/lib/gen/base-url";
import type { User } from "backend/lib/better-auth";
import { type ClassValue, clsx } from "clsx";
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
