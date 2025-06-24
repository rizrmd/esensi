import type { ApiResponse } from "backend/lib/utils";
import type { ConfigItem } from "../../lib/types";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "cfg_create",
  url: "/api/internal/cfg/create",
  async handler(arg: {
    key: string;
    value: string;
  }): Promise<ApiResponse<ConfigItem>> {
    const { key, value } = arg;

    // Check if key already exists
    const existing = await db.cfg.findUnique({ where: { key } });

    if (existing) throw new Error("Configuration key already exists");

    const result = await db.cfg.create({ data: { key, value } });

    return {
      success: true,
      data: result,
    };
  },
});
