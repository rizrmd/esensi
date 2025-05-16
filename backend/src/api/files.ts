import { join } from "node:path";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "files",
  url: "/_file/upload/*",
  async handler(): Promise<Response> {
    const req = this.req!;
    return new Response(
      Bun.file(
        join(
          process.cwd(),
          "_file/upload",
          ...req.url.split("/_file/upload/").slice(1)
        )
      )
    );
  },
});
