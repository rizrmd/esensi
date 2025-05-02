import { defineAPI } from "rlib/server";
import type { User } from "better-auth/types";

export default defineAPI({
  name: "author_profile",
  url: "/api/author/profile",
  async handler(arg: { user: User }) {
    try {
      const author = await db.author.findFirst({
        where: { 
          auth_user: {
            some: {
              id: arg.user.id
            }
          }
        },
        include: {
          auth_user: true,
          auth_account: true,
          publisher_author: {
            include: {
              publisher: true
            }
          },
          product: {
            where: {
              deleted_at: null
            },
            orderBy: {
              published_date: 'desc'
            }
          }
        }
      });

      return { success: true, author };
    } catch (error) {
      console.error("Error fetching author profile:", error);
      return { success: false, message: "Gagal mengambil profil penulis" };
    }
  },
});