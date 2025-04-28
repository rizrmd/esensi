import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "auth_user",
  url: "/api/auth/user",
  async handler(arg: { username: string }) {
    const res = await db.auth_user.findFirst({
      where: {
        OR: [
          {email: arg.username},
          {username: arg.username,}
        ],
      },
    });
    return res;
  },
});
