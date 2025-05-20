import { join } from "node:path";
import { URLSearchParams } from "node:url";
import { defineAPI } from "rlib/server";
import sharp from "sharp";

export default defineAPI({
  name: "files",
  url: "/_file/upload/*",
  async handler(): Promise<Response> {
    const req = this.req!;
    let path = req.url.split("?")[0];
    const qs = "?" + req.url.split("?")[1];
    const fileName = path!.split("/_file/upload/").slice(1).join("/");
    const fileExtension = fileName.split(".").pop();

    const isImage =
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "png" ||
      fileExtension === "gif" ||
      fileExtension === "webp";

    path = join(
      process.cwd(),
      "_file/upload",
      ...path!.split("/_file/upload/").slice(1)
    );
    let bunFile = Bun.file(path);

    if (!(await bunFile.exists())) {
      if (isImage) {
        return Response.redirect(
          "https://esensi.online/_img/upload/" +
            req.url.split("/_file/upload/").slice(1).join("/") +
            qs
        );
      } else {
        return Response.redirect(
          "https://esensi.online/_file/upload/" +
            req.url.split("/_file/upload/").slice(1).join("/")
        );
      }
    } else {
      if (isImage) {
        const params = new URLSearchParams(qs);
        const width = params.get("w");
        const height = params.get("h");
        let resize: Record<string, string | number> = {};
        if (!!params.get("w")) if (!!width) resize.width = parseInt(width!);
        if (!!height) resize.height = parseInt(height!);
        const image = await sharp(path).resize(resize).toBuffer();
        return new Response(image);
      } else return new Response(bunFile);
    }
  },
});
