import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { username, twoFactor, openAPI } from "better-auth/plugins";
import nodemailer from "nodemailer";
import { randomUUIDv7 } from "bun";

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
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        // templateAlias: "password-reset",
        // templateModel: {
        //   product_url: process.env.PRODUCT_URL as string,
        //   product_name: process.env.PRODUCT_NAME as string,
        //   name: user.name,
        //   action_url: url,
        //   operating_system: "operating_system_Value",
        //   browser_name: getBrowserInfo(),
        //   company_name: process.env.COMPANY_NAME as string,
        //   company_address: process.env.COMPANY_ADDRESS as string,
        // },
        subject: "Password Reset",
        text: `Click here to reset your password: ${url}`,
        html: `<div>Click here to reset your password: <a href="${url}">Reset</a></div>`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        // templateAlias: "email-verification",
        // templateModel: {
        //   product_url: process.env.PRODUCT_URL as string,
        //   product_name: process.env.PRODUCT_NAME as string,
        //   action_url: url,
        //   login_url: (process.env.LOGIN_URL as string) + "/login",
        //   username: user.email,
        //   company_name: process.env.COMPANY_NAME as string,
        //   name: user.name,
        // },
        subject: "Email Verification",
        text: `Click here to verify your email: ${url}`,
        html: `<div>Click here to verify your email: <a href="${url}">Verify</a></div>`,
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
  trustedOrigins: [
    "http://localhost:7500",
    "http://localhost:8100",
    "http://localhost:8500",
  ],
  plugins: [
    openAPI(), // /api/auth/refernce
    username(),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }, request) {
          if (!otp) throw new Error("OTP not found");
          if (!request) throw new Error("Request not found");
          if (!request.headers) throw new Error("Request headers not found");
          const host = request.headers.get("host");
          if (!host) throw new Error("Host not found");
          const action_url = `https://${host}/auth/verify-otp?otp=${otp}`;
          await sendEmail({
            to: user.email,
            // templateAlias: "otp-code-request",
            // templateModel: {
            //   product_url: process.env.PRODUCT_URL as string,
            //   product_name: process.env.PRODUCT_NAME as string,
            //   name: user.name,
            //   otp_code: otp,
            //   action_url,
            //   company_name: process.env.COMPANY_NAME as string,
            //   company_address: process.env.COMPANY_ADDRESS as string,
            // },
            subject: "OTP Code Request",
            text: `Hello ${user.name},\n\nYour OTP code is: ${otp}\n\nClick here to verify: ${action_url}`,
            html: `<div>Hello ${user.name},\n\nYour OTP code is: ${otp}\n\nClick here to verify: <a href="${action_url}">Verify</a></div>`,
          });
        },
      },
    }),
  ],
  session: {
    modelName: "session",
    fields: {
      userId: "id_user_role",
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
    accountLinking: {
      trustedProviders: ["email-password", "google", "facebook"],
    },
    modelName: "user",
    fields: {
      userId: "id_user_role",
      accountId: "id_user",
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
    modelName: "user_role",
    fields: {
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
});

export const utils = {
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
