import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "check",
  url: "/check/:name",
  async handler() {
    const result = await db.user_info.findFirst({
      select: {
        id: true,
      },
      where: {},
      // debug: true,
    });

    db.user.create({
      data: { affiliates: [{}] },
    });
    // console.log(result.sql);

    return result;
  },
});
