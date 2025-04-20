// Auto-generated API exports
import type { ApiDefinitions } from "rlib/server";
import { default as auth_esensi_check } from "../api/auth.esensi/check";
import { default as publish_esensi_check } from "../api/publish.esensi/check";
import { default as internal_esensi_coba } from "../api/internal.esensi/coba";
import { default as internal_esensi_check } from "../api/internal.esensi/check";

export const backendApi = {
  "auth.esensi": {
    "check": ["/api/check", auth_esensi_check]
  },
  "publish.esensi": {
    "check": ["/api/check", publish_esensi_check]
  },
  "internal.esensi": {
    "coba": ["/api/coba", internal_esensi_coba],
    "check": ["/api/check", internal_esensi_check]
  }
} as const satisfies ApiDefinitions;
