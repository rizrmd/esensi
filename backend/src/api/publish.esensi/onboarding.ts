import type { ApiResponse } from "backend/lib/utils";
import { defineAPI } from "rlib/server";
import { Role, type Onboarding } from "../types";

export type author = {
  name: string;
  biography: string;
  social_media: string;
  avatar: string | null;
};

export type publisher = {
  name: string;
  description: string;
  website: string;
  address: string;
  logo: string | null;
};

export default defineAPI({
  name: "onboarding",
  url: "/api/publish/onboarding",
  async handler(arg: {
    role: Role.AUTHOR | Role.PUBLISHER;
    userId: string;
    data: author | publisher;
  }): Promise<ApiResponse<Onboarding>> {
    const { role, userId, data } = arg;
    try {
      const account = await db.auth_account.findFirst({
        where: { id_user: userId },
      });
      if (!account) {
        return { success: false, message: "Akun tidak ditemukan" };
      }

      if (role === Role.AUTHOR) {
        const author = data as author;
        const newAuthor = await db.author.create({
          data: {
            name: author.name!,
            id_account: account.id,
            avatar: author.avatar,
            biography: author.biography,
            social_media: author.social_media,
          },
        });

        await db.auth_user.update({
          where: { id: userId },
          data: {
            id_author: newAuthor.id,
            name: author.name,
            image: author.avatar,
          },
        });

        return {
          success: true,
          message: "Berhasil onboarding sebagai penulis",
          data: { author: newAuthor },
        };
      } else if (role === Role.PUBLISHER) {
        const publisher = data as publisher;
        const newPublisher = await db.publisher.create({
          data: {
            name: publisher.name!,
            id_account: account.id,
            description: publisher.description,
            website: publisher.website,
            address: publisher.address,
            logo: publisher.logo,
          },
        });

        await db.auth_user.update({
          where: { id: userId },
          data: {
            id_publisher: newPublisher.id,
            name: publisher.name,
            image: publisher.logo,
          },
        });

        return {
          success: true,
          message: "Berhasil onboarding sebagai penerbit",
          data: { publisher: newPublisher },
        };
      } else return { success: false, message: "Role tidak valid" };
    } catch (error) {
      console.error("Error on user onboarding:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat onboarding",
      };
    }
  },
});
