import { defineAPI } from "rlib/server";
import type { User } from "better-auth/types";

export default defineAPI({
  name: "onboarding",
  url: "/api/onboarding",
  async handler(arg: { role: "author" | "publisher"; user: User }) {
    const { role, user } = arg;
    try {
      const account = await db.auth_account.findFirst({
        where: { id_user: user.id },
      });
      if (!account) {
        return { success: false, message: "Akun tidak ditemukan" };
      }

      // Handle based on selected role
      if (role === "author") {
        // Create new author entry
        const newAuthor = await db.author.create({
          data: { name: user.name, id_account: account.id },
        });

        // Update auth_user with id_author
        await db.auth_user.update({
          where: { id: user.id },
          data: { id_author: newAuthor.id },
        });

        return {
          success: true,
          message: "Berhasil terdaftar sebagai penulis",
          author: newAuthor,
        };
      } else if (role === "publisher") {
        // Create new publisher entry
        const newPublisher = await db.publisher.create({
          data: { name: user.name, id_account: account.id },
        });

        // Update auth_user with id_publisher
        await db.auth_user.update({
          where: { id: user.id },
          data: { id_publisher: newPublisher.id },
        });

        return {
          success: true,
          message: "Berhasil terdaftar sebagai penerbit",
          publisher: newPublisher,
        };
      } else {
        return { success: false, message: "Peran tidak valid" };
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat mendaftarkan peran:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat mendaftarkan peran",
      };
    }
  },
});
