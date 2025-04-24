// Auto-generated API exports
import type { ApiDefinitions } from "rlib/server";
import { default as auth_esensi_check } from "backend/src/api/auth.esensi/check";
import { default as publish_esensi_check } from "backend/src/api/publish.esensi/check";
import { default as internal_esensi_check } from "backend/src/api/internal.esensi/check";

export const backendApi = {
  "auth.esensi": {
    "check": ["/api/check", auth_esensi_check]
  },
  "publish.esensi": {
    "check": ["/api/check", publish_esensi_check]
  },
  "internal.esensi": {
    "check": ["/api/check", internal_esensi_check]
  }
} as const satisfies ApiDefinitions;
