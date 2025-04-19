import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "logout",
  url: "/api/auth/logout",
  handler: async () => {
    console.log("hello-world");
    return {};
  },
});
