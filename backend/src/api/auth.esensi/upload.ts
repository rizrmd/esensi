import { Busboy } from "@fastify/busboy";
import { join } from "node:path";
import { Readable } from "node:stream";
import { defineAPI, dir } from "rlib/server";

export default defineAPI({
  name: "upload",
  url: "/api/upload",
  async handler() {
    const req = this.req!;
    const type = req.headers.get("content-type");
    if (!req.body || !type) {
      return { error: "No file uploaded" };
    }
    const busboy = new Busboy({
      headers: { "content-type": type },
    });
    Readable.fromWeb(req.body).pipe(busboy);

    const date = new Date();
    const dateDir = `${date.getFullYear()}-${date.getMonth() + 0}-${date.getDay()}`;
    const dirname = [
      "upload",
      dateDir,
    ];
    dir.ensure(join(process.cwd(), ...dirname));

    const upload = await new Promise<{ name: string; file: Buffer }>((done) => {
      busboy.on("file", (name, file, info) => {
        file
          .on("data", (data) => {
            done({ name: info, file: data });
          })
          .on("close", () => {
            console.log(`File [${name}] done`);
          });
      });
    });

    const fileName = Date.now() + "-" + upload.name;
    const file = Bun.file(join(process.cwd(), ...dirname, fileName));

    await file.write(upload.file);
    return { name: "/" + ["files", dateDir, fileName].join("/") };
  },
});
