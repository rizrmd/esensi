import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { username, twoFactor, openAPI } from "better-auth/plugins";
import nodemailer from "nodemailer";
import { randomUUIDv7 } from "bun";

const aStyle = `display: inline-block; padding: 10px 20px; background-color: #222831; color: white; text-decoration: none; border-radius: 5px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-align: center; text-decoration: none;
`;

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
        subject: "Verifikasi Email Esensi Online",
        text: `
Esensi Online
Verifikasi Email
Hai, ${user.email}.
Terima kasih sudah mendaftarkan diri pada Esensi Online.
Silakan klik link berikut untuk memverifikasi akun email Anda. Link ini akan kedaluwarsa setelah 24 jam.
${url}
`,
        html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <body style="background-color:#ffffff;margin:0 auto;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif">
    <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
      Verifikasi Email Esensi Online
    </div>
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:37.5em;margin:0 auto;padding:0px 20px">
      <tbody>
        <tr style="width:100%">
          <td>
            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:32px">
              <tbody>
                <tr>
                  <td>
                    <img alt="Esensi Online" height="50" src="https://esensi.online/logo.webp" style="display:block;outline:none;border:none;text-decoration:none" width="50" />
                  </td>
                </tr>
              </tbody>
            </table>
            <h1 style="color:#1d1c1d;font-size:36px;font-weight:700;margin:30px 0;padding:0;line-height:42px">
              Verifikasi Email Esensi Online
            </h1>
            <p style="font-size:20px;line-height:28px;margin:16px 0;margin-bottom:30px">
              Silakan klik link berikut untuk memverifikasi email Anda
            </p>
            
             <div style="text-align:center; margin:30px"><a href="${url}" style="${aStyle}" target="_blank">Verifikasi Email</a></div>
            <p style="font-size:14px;line-height:24px;margin:16px 0;color:#000">
              Jika Anda tidak meminta email ini, Anda bisa mengabaikannya.
            </p>
            <hr class="border-t border-gray-300" style="width:100%;border:none;border-top:1px solid #eaeaea" />
            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
              <tbody>
                <tr>
                  <td>
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tbody style="width:100%">
                        <tr style="width:100%">
                          <td data-id="__react-email-column" style="width:50px">
                            <img alt="Esensi Online" height="40" src="https://esensi.online/logo.webp" style="display:block;outline:none;border:none;text-decoration:none" width="40" />
                          </td>
                          <td data-id="__react-email-column">
                            <p class="m-0" style="font-size:14px;line-height:24px;margin:16px 0">
                              Esensi Online<br />PT. Meraih Ilmu Semesta
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`,
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
          // templateAlias: "email-change-verification",
          // templateModel: {
          //   product_url: process.env.PRODUCT_URL as string,
          //   product_name: process.env.PRODUCT_NAME as string,
          //   name: data.user.name,
          //   action_url: data.url,
          //   company_name: process.env.COMPANY_NAME as string,
          //   company_address: process.env.COMPANY_ADDRESS as string,
          // },
          subject: "Email Change Verification",
          text: `There is a request to change your enmail to ${data.newEmail}. Click here to verify your email change: ${data.url}`,
          html: `<div>There is a request to change your enmail to ${data.newEmail}. Click here to verify your email change: <a href="${data.url}">Verify</a></div>`,
        });
      },
    },
    deleteUser: {
      async beforeDelete(user, request) {
        await sendEmail({
          to: user.email,
          // templateAlias: "account-deletion-request",
          // templateModel: {
          //   product_url: process.env.PRODUCT_URL as string,
          //   product_name: process.env.PRODUCT_NAME as string,
          //   name: user.name,
          //   company_name: process.env.COMPANY_NAME as string,
          //   company_address: process.env.COMPANY_ADDRESS as string,
          // },
          subject: "Account Deletion Request",
          text: `There is a request to delete your account. If you did not make this request, please contact support.`,
          html: `<div>There is a request to delete your account. If you did not make this request, please contact support.</div>`,
        });
      },
      async afterDelete(user, request) {
        await sendEmail({
          to: user.email,
          // templateAlias: "account-deletion",
          // templateModel: {
          //   product_url: process.env.PRODUCT_URL as string,
          //   product_name: process.env.PRODUCT_NAME as string,
          //   name: user.name,
          //   company_name: process.env.COMPANY_NAME as string,
          //   company_address: process.env.COMPANY_ADDRESS as string,
          // },
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
