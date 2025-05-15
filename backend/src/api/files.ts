import { defineAPI } from "rlib/server";
import { join } from "node:path";

export default defineAPI({
  name: "files",
  url: "/_file/upload/*",
  async handler() {
    const req = this.req!;
    return new Response(Bun.file(join(process.cwd(), "_file/upload", ...req.url.split("/_file/upload/").slice(1))));
  }
});
