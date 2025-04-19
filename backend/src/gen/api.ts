// Auto-generated API exports
import type { ApiDefinitions } from "rlib/server";
import { default as auth_esensi_login } from "../api/auth.esensi/login";
import { default as auth_esensi_check } from "../api/auth.esensi/check";
import { default as auth_esensi_logout } from "../api/auth.esensi/logout";

export const backendApi = {
  "auth.esensi": {
    "login": ["/api/auth/login", auth_esensi_login],
    "check": ["/check/:name", auth_esensi_check],
    "logout": ["/api/auth/logout", auth_esensi_logout]
  }
} as const satisfies ApiDefinitions;
