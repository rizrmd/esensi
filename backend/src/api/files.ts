import { join } from "node:path";
import { defineAPI } from "rlib/server";
import sharp from "sharp";

export default defineAPI({
  name: "files",
  url: "/_file/upload/*",
  async handler(): Promise<Response> {
    const req = this.req!;
    const fileName = req.url.split("/_file/upload/").slice(1).join("/");
    const fileExtension = fileName.split(".").pop();
    const isImage =
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "png" ||
      fileExtension === "gif" ||
      fileExtension === "webp";
    const path = join(
      process.cwd(),
      "_file/upload",
      ...req.url.split("/_file/upload/").slice(1)
    );
    let bunFile = Bun.file(path);
    if (!(await bunFile.exists())) {
      if (isImage) {
        return Response.redirect(
          "https://esensi.online/_img/upload/" +
            req.url.split("/_file/upload/").slice(1).join("/") +
            "?w=350"
        );
      } else {
        return Response.redirect(
          "https://esensi.online/_file/upload/" +
            req.url.split("/_file/upload/").slice(1).join("/")
        );
      }
    } else {
      if (isImage) {
        const image = await sharp(path).resize(350).toBuffer();
        return new Response(image);
      } else return new Response(bunFile);
    }
  },
});
