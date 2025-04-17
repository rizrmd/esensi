import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { username, twoFactor } from "better-auth/plugins";
import nodemailer from "nodemailer";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    // ssl: { rejectUnauthorized: true },
  }),
  emailAndPassword: { enabled: true, autoSignIn: false },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      scopes: ["email", "public_profile", "user_friends"], // Overwrites permissions
      fields: ["id", "name", "email", "picture", "user_friends"], // Extending list of fields
    },
  },
  plugins: [
    username(),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }, request) {
          // Send OTP to the user's email
          const sendEmail = async (subject: string, text: string) => {
            // console.log(
            //   `Sending email to ${user.email} with subject "${subject}" and text "${text}"`
            // );
            // Implement your email sending logic here.You can use any email sending library or service.
            // For example, using nodemailer or any other email service
            const transporter = nodemailer.createTransport({
              service: "Gmail",
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
              },
            });
            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: user.email,
              subject,
              text,
            };
            await transporter.sendMail(mailOptions);
          };

          if (!otp) throw new Error("OTP not found");
          if (!request) throw new Error("Request not found");
          if (!request.headers) throw new Error("Request headers not found");
          const host = request.headers.get("host");
          if (!host) throw new Error("Host not found");
          const url = `https://${host}/auth/verify-otp?otp=${otp}`;
          const subject = "Your OTP Code";
          const text = `Hello ${user.name},\n\nYour OTP code is: ${otp}\n\nClick here to verify: ${url}`;
          await sendEmail(subject, text);
        },
      },
    }),
  ],
  session: {
    modelName: "session",
    fields: {
      userId: "user_id",
      expiresAt: "expires_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  verification: {
    modelName: "verification",
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  account: {
    modelName: "user",
    fields: {
      userId: "user_info_id",
      accountId: "username",
      providerId: "provider_id",
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
    modelName: "user_info",
    fields: {
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
});

export const utils = {
  mapping: {
    table: (name: string) => {
      if (name === "user") return "user_info";
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
        user_id: userId,
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
        user_info_id: userId,
        username: accountId,
        provider_id: providerId,
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
      }: {
        emailVerified: string;
        createdAt: string;
        updatedAt: string;
      }) => ({
        email_verified: emailVerified,
        created_at: createdAt,
        updated_at: updatedAt,
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
        user_id: response?.session.userId,
        expires_at: response?.session.expiresAt,
        ip_address: response?.session.ipAddress,
        user_agent: response?.session.userAgent,
        created_at: response?.session.createdAt,
        updated_at: response?.session.updatedAt,
      },
      user_info: {
        ...response?.user,
        email_verified: response?.user.emailVerified,
        created_at: response?.user.createdAt,
        updated_at: response?.user.updatedAt,
      },
    };
  },
};
