import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "check",
  url: "/api/check",
  async handler(arg: { id: string }) {
    const res = await db.auth_account.findFirst({
      where: {
        id: arg.id,
      },
      select: {
        id: true,
        created_at: true,
        id_token: true,
        scope: true,
        auth_user: {
          select: {
            display_username: true,
          }
        },
        customer: {
          select: {
            id: true,
          }
        },
      },
    });
    return res;
  },
});
