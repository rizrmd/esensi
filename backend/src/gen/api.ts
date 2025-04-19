// Auto-generated API exports
import { default as auth_esensi_login } from "../api/auth.esensi/login";
import { default as auth_esensi_check } from "../api/auth.esensi/check";
import { default as auth_esensi_logout } from "../api/auth.esensi/logout";

export const api = {
  "auth.esensi": {
    "/api/auth/login": auth_esensi_login,
    "/check/:name": auth_esensi_check,
    "/api/auth/logout": auth_esensi_logout
  }
};
