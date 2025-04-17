import { defineAPI } from "rlib";

export default defineAPI({
  url: "/auth/login",
  handler: async (username:string) => {
    console.log("asda");
    
    return {};
  },
});
