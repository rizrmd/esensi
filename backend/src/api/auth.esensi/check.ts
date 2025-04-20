import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "check",
  url: "/api/check",
  async handler() {
    const req = this.req!;
    const res = await db.user.findFirst({
      select: {
        id: true,
        created_at: true,
        id_token: true,
        scope: true,
        user_info: {
          display_username: true,
        },
        customers: {
          id: true,
        },
      },
    });

    res?.id;
    res?.id_token;
    res?.created_at;
    res?.scope;
    res?.customers[0]!.id;

    console.log("route: " + "/api/check");
    return {};
  },
});
