import { defineAPI } from "rlib";

export default defineAPI({
  url: "/api/auth/check",
  handler: async () => {

    console.log("oke deh");
    return {};
  },
});
 