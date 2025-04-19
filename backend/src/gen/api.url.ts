// Auto-generated API exports
import type { ApiUrls } from "rlib/server";

export const endpoints = {
  "auth.esensi": {
    "login": "/api/auth/login",
    "check": "/check/:name",
    "logout": "/api/auth/logout"
  }
} as const satisfies ApiUrls;
