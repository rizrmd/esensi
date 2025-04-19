import { defineAPI } from "rlib/server";

export default defineAPI({
  url: "/api/auth/login",
  handler: async (username:string) => {
    console.log("asda");
    
    return {};
  },
});
