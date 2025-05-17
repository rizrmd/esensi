import type { User } from "backend/lib/better-auth";
import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import type { Onboarding } from "../types";

export default defineAPI({
  name: "onboarding",
  url: "/api/publish/onboarding",
  async handler(arg: {
    role: "author" | "publisher";
    user: Partial<User>;
  }): Promise<ApiResponse<Onboarding>> {
    const { role, user } = arg;
    try {
      const account = await db.auth_account.findFirst({
        where: { id_user: user.id },
      });
      if (!account) {
        return { success: false, message: "Akun tidak ditemukan" };
      }

      if (role === "author") {
        const newAuthor = await db.author.create({
          data: { name: user.name!, id_account: account.id },
        });

        await db.auth_user.update({
          where: { id: user.id },
          data: { id_author: newAuthor.id },
        });

        return {
          success: true,
          message: "Berhasil onboarding sebagai penulis",
          data: { author: newAuthor },
        };
      } else if (role === "publisher") {
        const newPublisher = await db.publisher.create({
          data: { name: user.name!, id_account: account.id },
        });

        await db.auth_user.update({
          where: { id: user.id },
          data: { id_publisher: newPublisher.id },
        });

        return {
          success: true,
          message: "Berhasil onboarding sebagai penerbit",
          data: { publisher: newPublisher },
        };
      } else {
        return { success: false, message: "Role tidak valid" };
      }
    } catch (error) {
      console.error("Error on onboarding:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat onboarding",
      };
    }
  },
});
