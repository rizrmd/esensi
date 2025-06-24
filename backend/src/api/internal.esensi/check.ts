import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "check",
  url: "/api/check",
  async handler(): Promise<ApiResponse<Record<string, any>>> {
    const req = this.req!;
    console.log("route: " + "/api/check");
    return {
      success: true,
      data: {},
    };
  },
});
