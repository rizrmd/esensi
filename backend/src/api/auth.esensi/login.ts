import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "login",
  url: "/api/auth/login",
  handler: async (arg: { username: string; password: string }) => {
    return { login: "username:" + arg.username };
  },
});
