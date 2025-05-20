import { join } from "node:path";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "files",
  url: "/_file/upload/*",
  async handler(): Promise<Response> {
    const req = this.req!;
    let bunFile = Bun.file(
      join(
        process.cwd(),
        "_file/upload",
        ...req.url.split("/_file/upload/").slice(1)
      )
    );
    if (!(await bunFile.exists())) {
      // check if file is an image
      const fileName = req.url.split("/_file/upload/").slice(1).join("/");
      const fileExtension = fileName.split(".").pop();
      if (
        fileExtension === "jpg" ||
        fileExtension === "jpeg" ||
        fileExtension === "png" ||
        fileExtension === "gif" ||
        fileExtension === "webp"
      ) {
        const path =
          "https://esensi.online/_img/upload/" +
          req.url.split("/_file/upload/").slice(1).join("/") +
          "?w=350";
        return Response.redirect(path);
      } else {
        const path =
          "https://esensi.online/_file/upload/" +
          req.url.split("/_file/upload/").slice(1).join("/");
        return Response.redirect(path);
      }
    }
    return new Response(bunFile);
  },
});
