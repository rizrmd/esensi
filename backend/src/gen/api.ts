// Auto-generated API exports
import type { ApiDefinitions } from "rlib/server";
import { default as publish_esensi_check } from "../api/publish.esensi/check";

export const backendApi = {
  "publish.esensi": {
    "check": ["/api/check", publish_esensi_check]
  }
} as const satisfies ApiDefinitions;
