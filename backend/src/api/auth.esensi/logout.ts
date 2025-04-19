import { defineAPI } from "rlib/server";

export default defineAPI({
  url: "/api/auth/logout",
  handler: async () => {
    console.log("hello-world");
    return {};
  },
});
