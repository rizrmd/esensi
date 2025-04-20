// Auto-generated API exports
import type { ApiDefinitions } from "rlib/server";
import { default as internal_esensi_check } from "../api/internal.esensi/check";
import { default as publish_esensi_check } from "../api/publish.esensi/check";
import { default as auth_esensi_check } from "../api/auth.esensi/check";

export const backendApi = {
  "internal.esensi": {
    "check": ["/api/check", internal_esensi_check]
  },
  "publish.esensi": {
    "check": ["/api/check", publish_esensi_check]
  },
  "auth.esensi": {
    "check": ["/api/check", auth_esensi_check]
  }
} as const satisfies ApiDefinitions;
