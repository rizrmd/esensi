import { defineAPI } from "rlib/server";
import type { User } from "better-auth/types";

export default defineAPI({
  name: "publisher_profile",
  url: "/api/publisher/profile",
  async handler(arg: { user: User }) {
    try {
      const publisher = await db.publisher.findFirst({
        where: {
          auth_user: {
            some: {
              id: arg.user.id,
            },
          },
        },
        include: {
          auth_user: true,
          auth_account: true,
          publisher_author: {
            include: {
              author: true,
            },
          },
          transaction: {
            orderBy: {
              created_at: "desc",
            },
            take: 10,
          },
          promo_code: {
            orderBy: {
              valid_to: "desc",
            },
          },
        },
      });

      return { success: true, publisher };
    } catch (error) {
      console.error("Error fetching publisher profile:", error);
      return { success: false, message: "Gagal mengambil profil penerbit" };
    }
  },
});
