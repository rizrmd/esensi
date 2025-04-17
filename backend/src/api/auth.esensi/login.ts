import { defineAPI } from "rlib";

export default defineAPI({
  url: "/auth/login",
  handler: async () => {
    console.log("asda");
    return {};
  },
});
