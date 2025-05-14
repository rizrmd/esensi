import { defineAPI } from "rlib/server";
import { join } from "node:path";

export default defineAPI({
  name: "files",
  url: "/files/*",
  async handler() {
    const req = this.req!;
    return new Response(Bun.file(join(process.cwd(), "upload", ...req.url.split("/files/").slice(1))));
  }
});
