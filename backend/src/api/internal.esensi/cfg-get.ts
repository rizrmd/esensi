import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "cfg_get",
  url: "/api/internal/cfg/get",
  async handler(arg: { key: string }) {
    const { key } = arg;

    const result = await db.cfg.findUnique({
      where: { key },
    });

    if (!result) {
      throw new Error("Configuration key not found");
    }

    return result;
  },
});
