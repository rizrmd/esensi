import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "login",
  url: "/api/auth/login",
  handler: async (username: string) => {
    return { login: "halo" };
  },
});
