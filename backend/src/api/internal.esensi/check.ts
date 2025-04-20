import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "check",
  url: "/api/check",
  async handler() {
    const req = this.req!;
    console.log("route: " + "/api/check");
    return {};
  },
});
