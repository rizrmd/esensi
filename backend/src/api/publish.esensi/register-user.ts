import type { User } from "backend/lib/better-auth";
import { defineAPI } from "rlib/server";

export default defineAPI({
  name: "register_user",
  url: "/api/auth/register-user",
  async handler(arg: { user: Partial<User> }) {
    try {
      const { user } = arg;

      const existingUser = await db.auth_user.findFirst({
        where: { id: user.id },
        include: {
          author: true,
        },
      });

      if (existingUser?.id_author) {
        return {
          success: true,
          message: "User already has an author record",
        };
      }

      const existingAccount = await db.auth_account.findFirst({
        where: { id_user: user.id },
      });

      const newAuthor = await db.author.create({
        data: {
          name: user.name!,
          id_account: existingAccount!.id,
        },
      });

      await db.auth_user.update({
        where: { id: user.id },
        data: {
          id_author: newAuthor.id,
        },
      });

      return {
        success: true,
        message: "Berhasil mendaftarkan akun Google sebagai penulis",
      };
    } catch (error) {
      return {
        success: false,
        message: "Terjadi kesalahan saat memproses akun Google",
      };
    }
  },
});
