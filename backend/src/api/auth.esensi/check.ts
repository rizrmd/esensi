import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "check",
  url: "/check/:name",
  async handler() {
    const req = this.req!;
    const res = "oke deh" + req.params.name;
    return res;
  },
});
