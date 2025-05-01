import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "auth_account",
  url: "/api/auth/account",
  async handler(arg: { userId: string, checkRole?: boolean }) {
    const res = await db.auth_account.findFirst({
      where: {
        id_user: arg.userId,
      },
    });
    return res;
  },
});
