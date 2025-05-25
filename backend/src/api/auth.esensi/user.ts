import { defineAPI } from "rlib/server";
import type { auth_user } from "shared/models";

export default defineAPI({
  name: "auth_user",
  url: "/api/auth/user",
  async handler(arg: { username: string }): Promise<auth_user | null> {
    const res = await db.auth_user.findFirst({
      where: {
        OR: [{ email: arg.username }, { username: arg.username }],
      },
    });
    return res;
  },
});
