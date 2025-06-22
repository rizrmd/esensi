import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "cfg_delete",
  url: "/api/internal/cfg/delete",
  async handler(arg: { key: string }) {
    const { key } = arg;

    // Check if key exists
    const existing = await db.cfg.findUnique({ where: { key } });

    if (!existing) throw new Error("Configuration key not found");

    const result = await db.cfg.delete({ where: { key } });

    return result;
  },
});
