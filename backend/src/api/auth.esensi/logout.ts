import { defineAPI } from "rlib";

export default defineAPI({
  url: "/api/hello/world",
  handler: async () => {
    console.log("hello-world");
    return {};
  },
});
