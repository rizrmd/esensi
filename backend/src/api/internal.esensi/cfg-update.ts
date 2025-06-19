import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "cfg_update",
  url: "/api/internal/cfg/update",
  async handler(arg: { key: string; value: string }) {
    const { key, value } = arg;

    // Check if key exists
    const existing = await db.cfg.findUnique({
      where: { key },
    });

    if (!existing) {
      throw new Error("Configuration key not found");
    }

    const result = await db.cfg.update({
      where: { key },
      data: { value },
    });

    return result;
  },
});
