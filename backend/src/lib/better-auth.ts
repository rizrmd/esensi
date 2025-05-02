import { APIError, betterAuth } from "better-auth";
import { openAPI, twoFactor, username } from "better-auth/plugins";
import { randomUUIDv7 } from "bun";
import nodemailer from "nodemailer";
import { Pool } from "pg";
import { dir, type SiteConfig } from "rlib/server";
import raw_config from "../../../config.json";
const config = raw_config as SiteConfig;

const templates = {
  emailVerification: await Bun.file(
    dir.path("backend/src/lib/template/email-verification.html")
  ).text(),
  resetPassword: await Bun.file(
    dir.path("backend/src/lib/template/reset-password.html")
  ).text(),
  otpCodeRequest: await Bun.file(
    dir.path("backend/src/lib/template/otp-code-request.html")
  ).text(),
  changeEmailVerification: await Bun.file(
    dir.path("backend/src/lib/template/change-email-verification.html")
  ).text(),
  beforeAccountDeletion: await Bun.file(
    dir.path("backend/src/lib/template/before-account-deletion.html")
  ).text(),
  afterAccountDeletion: await Bun.file(
    dir.path("backend/src/lib/template/after-account-deletion.html")
  ).text(),
};

// Helper function to translate error messages to Bahasa Indonesia
const translateErrorMessage = (errorMessage: string): string => {
  const errorTranslations: Record<string, string> = {
    // Authentication errors
    "Invalid email or password": "Email atau kata sandi tidak valid",
    "Invalid password": "Kata sandi tidak valid",
    "Invalid credentials": "Kredensial tidak valid",
    "Email already exists": "Email sudah terdaftar",
    "Email not found": "Email tidak ditemukan",
    "Email not verified":
      "Email belum diverifikasi. Silakan verifikasi email Anda terlebih dahulu",
    "Password is required": "Kata sandi wajib diisi",
    "Password must be at least 8 characters":
      "Kata sandi harus minimal 8 karakter",
    "Password is too weak":
      "Kata sandi terlalu lemah. Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol",
    "Email is required": "Email wajib diisi",
    "Invalid email format": "Format email tidak valid",
    "User not found": "Pengguna tidak ditemukan",
    "User already exists": "Pengguna ini sudah pernah terdaftar",
    "Token expired": "Token sudah kedaluwarsa. Silakan meminta token baru",
    "Invalid token": "Token tidak valid",
    "Account already linked": "Akun sudah terhubung",

    // Two-factor authentication errors
    "Two-factor authentication required": "Verifikasi dua langkah diperlukan",
    "Invalid OTP": "Kode OTP tidak valid",
    "OTP expired": "Kode OTP sudah kedaluwarsa. Silakan meminta kode baru",

    // Session errors
    "Session expired": "Sesi Anda telah berakhir. Silakan masuk kembali",
    "Invalid session": "Sesi tidak valid",

    // Permission errors
    Unauthorized: "Tidak memiliki izin",
    Forbidden: "Akses ditolak",

    // General errors
    "Something went wrong": "Terjadi kesalahan. Silakan coba lagi nanti",
    "Rate limit exceeded": "Terlalu banyak percobaan. Silakan coba lagi nanti",
  };

  // Check for partial matches if exact match is not found
  if (errorTranslations[errorMessage]) {
    return errorTranslations[errorMessage];
  }

  // Check for specific parts of error messages
  for (const [key, value] of Object.entries(errorTranslations)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Return original message if no translation found
  return errorMessage;
};

const aStyle = `display: inline-block; padding: 10px 20px; background-color: #222831; color: white; text-decoration: none; border-radius: 5px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-align: center; text-decoration: none;`;

const sendEmail = async ({
  to,
  subject,
  text,
  html,
  templateAlias,
  templateModel,
}: {
  to: string;
  subject?: string;
  text?: string;
  html?: string;
  templateAlias?: string;
  templateModel?: object;
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER as string,
    port: 2525,
    auth: {
      user: process.env.SMTP_USER as string,
      pass: process.env.SMTP_PASS as string,
    },
  });
  const mail =
    templateAlias && templateModel
      ? {
        from: process.env.SMTP_FROM as string,
        to,
        templateAlias,
        templateModel,
      }
      : {
        from: process.env.SMTP_FROM as string,
        to,
        subject,
        text,
        html,
      };
  try {
    await transporter.sendMail(mail);
  } catch (err) {
    console.error(err);
  }
};

export const auth = betterAuth({
  hooks: {
    async after(ctx) {
      const error = (ctx as any).context?.returned as APIError;

      if (error) {
        error.message = translateErrorMessage(error.message);
        error.body = {
          ...error.body,
          message: error.message
        }
      }

      return ctx;
    },
  },
  advanced: {
    database: {
      generateId: () => randomUUIDv7(),
    },
  },
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset Password Esensi Online",
        text: `
Esensi Online
Reset Password
Silakan klik link berikut untuk mengatur ulang password Anda
${url}
`,
        html: templates.resetPassword
          .replaceAll("[[url]]", url)
          .replaceAll("[[aStyle]]", aStyle),
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verifikasi Email Esensi Online",
        text: `
Esensi Online
Verifikasi Email
Hai, ${user.email}.
Terima kasih sudah mendaftarkan diri pada Esensi Online.
Silakan klik link berikut untuk memverifikasi akun email Anda. Link ini akan kedaluwarsa setelah 24 jam.
${url}
`,
        html: templates.emailVerification
          .replaceAll("[[url]]", url)
          .replaceAll("[[aStyle]]", aStyle),
      });
    },
    expiresIn: 3600, // 1 hour
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    // facebook: {
    //   clientId: process.env.FACEBOOK_CLIENT_ID as string,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    //   scopes: ["email", "public_profile", "user_friends"], // Overwrites permissions
    //   fields: ["id", "name", "email", "picture", "user_friends"], // Extending list of fields
    // },
  },
  trustedOrigins(req) {
    const url = new URL(req.url);
    const forwardedHost = req.headers.get("x-forwarded-host");
    const trusted = [] as string[];

    for (const site of Object.values(config.sites)) {
      trusted.push(`http://localhost:${site.devPort}`);
    }
    if (url.hostname === "127.0.0.1" && !!forwardedHost) {
      if (forwardedHost.endsWith(".github.dev")) {
        const parts = forwardedHost.split("-");

        for (const site of Object.values(config.sites)) {
          const lastPart = parts[parts.length - 1]!.split(
            "."
          );

          lastPart[0] = site.devPort! + '';
          parts[parts.length - 1] = lastPart.join('.');

          trusted.push(`https://${parts.join("-")}`);
        }
      }
    }
    return trusted;
  },
  plugins: [
    openAPI(), // /api/auth/reference
    username(),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }, request) {
          if (!otp) throw new Error("OTP not found");
          if (!request) throw new Error("Request not found");
          if (!request.headers) throw new Error("Request headers not found");
          const host = request.headers.get("host");
          if (!host) throw new Error("Host not found");
          const url = `https://${host}/auth/verify-otp?otp=${otp}`;
          await sendEmail({
            to: user.email,
            subject: "Kode OTP Esensi Online",
            text: `
Esensi Online
Kode OTP
Kode OTP Anda: ${otp}
Silakan masukkan kode OTP untuk verifikasi
${url}
`,
            html: templates.otpCodeRequest
              .replaceAll("[[otp]]", otp)
              .replaceAll("[[url]]", url)
              .replaceAll("[[aStyle]]", aStyle),
          });
        },
      },
    }),
  ],
  session: {
    modelName: "auth_session",
    fields: {
      userId: "id_user",
      expiresAt: "expires_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  verification: {
    modelName: "auth_verification",
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  account: {
    accountLinking: {
      trustedProviders: ["email-password", "google", "facebook"],
    },
    modelName: "auth_account",
    fields: {
      accountId: "id_account",
      userId: "id_user",
      providerId: "id_provider",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      idToken: "id_token",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  user: {
    modelName: "auth_user",
    fields: {
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    additionalFields: {
      id_customer: { type: "string", required: false },
      id_author: { type: "string", required: false },
      id_affiliate: { type: "string", required: false },
      id_management: { type: "string", required: false },
      id_publisher: { type: "string", required: false },
      id_sales_and_marketing: { type: "string", required: false },
      id_support: { type: "string", required: false },
    },
    changeEmail: {
      enabled: true,
      async sendChangeEmailVerification(data, request) {
        await sendEmail({
          to: data.user.email,
          subject: "Verifikasi Perubahan Email Esensi Online",
          text: `
Esensi Online
Verifikasi Perubahan Email
Ada permintaan perubahan email Anda menjadi ${data.newEmail}.
Silakan klik link berikut untuk memverifikasi perubahan email Anda
${data.url}
`,
          html: templates.changeEmailVerification
            .replaceAll("[[newUrl]]", data.newEmail)
            .replaceAll("[[url]]", data.url)
            .replaceAll("[[aStyle]]", aStyle),
        });
      },
    },
    deleteUser: {
      async beforeDelete(user, request) {
        await sendEmail({
          to: user.email,
          subject: "Permintaan Hapus Akun Esensi Online",
          text: `
Esensi Online
Permintaan Hapus Akun
Ada permintaan untuk menghapus akun Anda.
Jika Anda tidak melakukan permintaan ini, silakan segera hubungi tim dukungan kami.
`,
          html: templates.beforeAccountDeletion,
        });
      },
      async afterDelete(user, request) {
        await sendEmail({
          to: user.email,
          subject: "Account Deletion",
          text: `Your account has been deleted.`,
          html: `<div>Your account has been deleted.</div>`,
        });
      },
    },
  },
});

export const utils = {
  mapping: {
    table: (name: string) => {
      if (name === "user") return "user_role";
      else if (name === "account") return "user";
      else return name;
    },
    column: {
      session: ({
        userId,
        expiresAt,
        ipAddress,
        userAgent,
        createdAt,
        updatedAt,
      }: {
        userId: string;
        expiresAt: string;
        ipAddress: string;
        userAgent: string;
        createdAt: string;
        updatedAt: string;
      }) => ({
        id_user_role: userId,
        expires_at: expiresAt,
        ip_address: ipAddress,
        user_agent: userAgent,
        created_at: createdAt,
        updated_at: updatedAt,
      }),
      verification: ({
        expiresAt,
        createdAt,
        updatedAt,
      }: {
        expiresAt: string;
        createdAt: string;
        updatedAt: string;
      }) => ({
        expires_at: expiresAt,
        created_at: createdAt,
        updated_at: updatedAt,
      }),
      account: ({
        userId,
        accountId,
        providerId,
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
        idToken,
        createdAt,
        updatedAt,
      }: {
        userId: string;
        accountId: string;
        providerId: string;
        accessToken: string;
        refreshToken: string;
        accessTokenExpiresAt: string;
        refreshTokenExpiresAt: string;
        idToken: string;
        createdAt: string;
        updatedAt: string;
      }) => ({
        id_user_role: userId,
        id_user: accountId,
        id_provider: providerId,
        access_token: accessToken,
        refresh_token: refreshToken,
        access_token_expires_at: accessTokenExpiresAt,
        refresh_token_expires_at: refreshTokenExpiresAt,
        id_token: idToken,
        created_at: createdAt,
        updated_at: updatedAt,
      }),
      user: ({
        emailVerified,
        createdAt,
        updatedAt,
        displayUsername,
        twoFactorEnabled,
      }: {
        emailVerified: string;
        createdAt: string;
        updatedAt: string;
        displayUsername: string;
        twoFactorEnabled: string;
      }) => ({
        email_verified: emailVerified,
        created_at: createdAt,
        updated_at: updatedAt,
        display_username: displayUsername,
        two_factor_enabled: twoFactorEnabled,
      }),
    },
  },
  signInEmail: async ({
    email,
    password,
    rememberMe = false,
    callbackURL = "/dashboard",
  }: {
    email: string;
    password: string;
    rememberMe?: boolean;
    callbackURL?: string;
  }): Promise<Response> => {
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe,
        callbackURL,
      },
      asResponse: true,
    });
    return response;
  },
  getSession: async (headers: Headers) => {
    const response = await auth.api.getSession({
      headers,
    });
    return {
      session: {
        ...response?.session,
        id_user_role: response?.session.userId,
        expires_at: response?.session.expiresAt,
        ip_address: response?.session.ipAddress,
        user_agent: response?.session.userAgent,
        created_at: response?.session.createdAt,
        updated_at: response?.session.updatedAt,
      },
      user_role: {
        ...response?.user,
        email_verified: response?.user.emailVerified,
        created_at: response?.user.createdAt,
        updated_at: response?.user.updatedAt,
        display_username: response?.user.displayUsername,
        two_factor_enabled: response?.user.twoFactorEnabled,
      },
    };
  },
};
