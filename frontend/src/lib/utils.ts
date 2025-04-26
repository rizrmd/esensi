import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function baseUrl() {
  if (["localhost", "127.0.0.1"].some((x) => x === location.hostname)) {
    return {
      main: "http://localhost:7000",
      auth: "http://localhost:7500",
      publish: "http://localhost:8100",
      internal: "http://localhost:8500",
    };
  } else {
    return {
      main: "https://esensi.online",
      auth: "http://auth.esensi.online",
      publish: "http://publish.esensi.online",
      internal: "http://internal.esensi.online",
    };
  }
}
