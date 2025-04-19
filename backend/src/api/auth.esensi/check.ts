import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "check",
  url: "/check/:name",
  async handler() {
    const result = await db.user.findFirst({
      select: {
        id: true,
        managements: {
          id: true,
        },
      },
      where: {
        id: "9a610f97-7613-4b90-9362-4bf29185efcf",
        // managements: {
        //   id_user: { eq: "9a610f97-7613-4b90-9362-4bf29185efcf" },
        // },
      },
    });

    return result;
  },
});
