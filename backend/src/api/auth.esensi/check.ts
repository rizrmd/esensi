import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "check",
  url: "/check/:name",
  async handler() {
    const result = await db.user_info.findFirst({
      select: {
        id: true,
        
        created_at: true,
        users: {
          id: true,
        },
      },
      where: {},
      // debug: true,
    });

    // console.log(result.sql);

    return result;
  },
});
