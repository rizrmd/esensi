import { apiClient } from "rlib/client";
import type { backendApi } from "backend/gen/api";
import { endpoints } from "backend/gen/api.url";

export const api = apiClient({} as typeof backendApi, endpoints, "auth.esensi");
