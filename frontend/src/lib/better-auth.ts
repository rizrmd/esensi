import { createAuthClient } from "better-auth/client";
import { twoFactorClient } from "better-auth/client/plugins";

type FetchOptions = {
  onRequest?: (ctx: any) => void;
  onSuccess?: (ctx: any) => void;
  onError?: (ctx: any) => void;
  onRetry?: (ctx: any) => void;
};

export type Session = typeof authClient.$Infer.Session;
export type User = Omit<
  (typeof authClient.$Infer.Session)["user"],
  "twoFactorEnabled"
> &
  Partial<{
    id_customer?: string;
    id_author?: string;
    id_affiliate?: string;
    id_management?: string;
    id_publisher?: string;
    id_sales_and_marketing?: string;
    id_support?: string;
  }>;

const authClient = createAuthClient({
  baseURL: `${location.protocol}//${location.host}`,
  plugins: [twoFactorClient()],
});

export const betterAuth = {
  homeUrl: (user: User) => {
    return "/dashboard";
  },
  signUp: async ({
    username,
    password,
    name,
    callbackURL = "/dashboard",
    image,
    fetchOptions,
  }: {
    username: string;
    password: string;
    name: string;
    callbackURL?: string;
    image?: string;
    fetchOptions?: FetchOptions | undefined;
  }) => {
    const { data, error } = await authClient.signUp.email({
      email: username,
      password,
      name,
      callbackURL,
      image,
      fetchOptions,
    });
    return { data, error };
  },
  signIn: async ({
    username,
    password,
    callbackURL = "/dashboard",
    rememberMe,
    fetchOptions,
  }: {
    username: string;
    password: string;
    callbackURL?: string;
    rememberMe?: boolean;
    fetchOptions?: FetchOptions | undefined;
  }) => {
    const { data, error } = await authClient.signIn.email(
      {
        email: username,
        password,
        callbackURL,
        rememberMe,
      },
      fetchOptions
    );
    return { data, error };
  },
  social: async ({
    provider,
    callbackURL = "/dashboard",
    errorCallbackURL = "/error",
    newUserCallbackURL = "/welcome",
    disableRedirect = false,
    idToken,
    loginHint,
    requestSignUp,
    scopes,
    fetchOptions,
  }: {
    provider:
      | "github"
      | "apple"
      | "discord"
      | "facebook"
      | "google"
      | "microsoft"
      | "spotify"
      | "twitch"
      | "twitter"
      | "dropbox"
      | "linkedin"
      | "gitlab"
      | "tiktok"
      | "reddit"
      | "roblox"
      | "vk"
      | "kick"
      | "zoom";
    callbackURL?: string;
    errorCallbackURL?: string;
    newUserCallbackURL?: string;
    disableRedirect?: boolean;
    idToken?: {
      token: string;
      refreshToken?: string | undefined;
      accessToken?: string | undefined;
      expiresAt?: number | undefined;
      nonce?: string | undefined;
    };
    loginHint?: string;
    requestSignUp?: boolean;
    scopes?: string[];
    fetchOptions?: FetchOptions | undefined;
  }) => {
    const { data, error } = await authClient.signIn.social({
      provider,
      callbackURL,
      errorCallbackURL,
      newUserCallbackURL,
      disableRedirect,
      idToken,
      loginHint,
      requestSignUp,
      scopes,
      fetchOptions,
    });
    return { data, error };
  },
  signOut: async ({
    query,
    fetchOptions,
  }: {
    query?: Record<string, any> | undefined;
    fetchOptions?: FetchOptions | undefined;
  } = {}) => {
    const { data, error } = await authClient.signOut({
      query,
      fetchOptions,
    });
    return { data, error };
  },
  useSession: () => {
    return authClient.useSession;
  },
  getSession: async () => {
    const { data: session, error } = await authClient.getSession();
    return { session, error };
  },
  twoFactor: {
    enable: async ({
      password,
      issuer,
      fetchOptions,
    }: {
      password: string;
      issuer?: string;
      fetchOptions?: FetchOptions | undefined;
    }) => {
      const { data, error } = await authClient.twoFactor.enable({
        password,
        issuer,
        fetchOptions,
      });
      return { data, error };
    },
    disable: async ({
      password,
      fetchOptions,
    }: {
      password: string;
      fetchOptions?: FetchOptions | undefined;
    }) => {
      const { data, error } = await authClient.twoFactor.disable({
        password,
        fetchOptions,
      });
      return { data, error };
    },
    getTotpUri: async ({
      password,
      fetchOptions,
    }: {
      password: string;
      fetchOptions: FetchOptions | undefined;
    }) => {
      const { data, error } = await authClient.twoFactor.getTotpUri({
        password,
        fetchOptions,
      });
      return { data, error };
    },
    verifyTotp: async ({
      code,
      trustDevice = false,
      fetchOptions,
    }: {
      code: string;
      trustDevice?: boolean;
      fetchOptions?: FetchOptions | undefined;
    }) => {
      const { data, error } = await authClient.twoFactor.verifyTotp({
        code,
        trustDevice,
        fetchOptions,
      });
      return { data, error };
    },
    sendOtp: async ({
      trustDevice,
      fetchOptions,
    }: {
      trustDevice?: boolean;
      fetchOptions?: FetchOptions | undefined;
    }) => {
      const { data, error } = await authClient.twoFactor.sendOtp({
        //@ts-ignore
        trustDevice,
        fetchOptions,
      });
      return { data, error };
    },
    verifyOtp: async ({
      code,
      trustDevice,
      fetchOptions,
    }: {
      code: string;
      trustDevice?: boolean;
      fetchOptions?: FetchOptions | undefined;
    }) => {
      const { data, error } = await authClient.twoFactor.verifyOtp({
        code,
        trustDevice,
        fetchOptions,
      });
      return { data, error };
    },
    sendVerificationEmail: async ({
      email,
      callbackURL,
      fetchOptions,
    }: {
      email: string;
      callbackURL: string;
      fetchOptions?: FetchOptions | undefined;
    }) => {
      await authClient.sendVerificationEmail({
        email,
        callbackURL,
        fetchOptions,
      });
    },
    verifyEmail: async ({
      query,
      fetchOptions,
    }: {
      query: { token: string; callbackURL?: string | undefined };
      fetchOptions?: FetchOptions | undefined;
    }) => {
      await authClient.verifyEmail({
        query,
        fetchOptions,
      });
    },
    forgetPassword: async ({
      email,
      redirectTo,
      fetchOptions,
    }: {
      email: string;
      redirectTo?: string | undefined;
      fetchOptions?: FetchOptions | undefined;
    }) => {
      await authClient.forgetPassword({
        email,
        redirectTo,
        fetchOptions,
      });
    },
    resetPassword: async ({
      newPassword,
      token,
      fetchOptions,
    }: {
      newPassword: string;
      token: string;
      fetchOptions?: FetchOptions | undefined;
    }) => {
      await authClient.resetPassword({
        newPassword,
        token,
        fetchOptions,
      });
    },
    changeEmail: async ({
      newEmail,
      callbackURL,
      fetchOptions,
    }: {
      newEmail: string;
      callbackURL?: string;
      fetchOptions?: FetchOptions | undefined;
    }) => {
      await authClient.changeEmail({
        newEmail,
        callbackURL,
        fetchOptions,
      });
    },
    changePassword: async ({
      currentPassword,
      newPassword,
      revokeOtherSessions,
      fetchOptions,
    }: {
      currentPassword: string;
      newPassword: string;
      revokeOtherSessions?: boolean | undefined;
      fetchOptions?: FetchOptions | undefined;
    }) => {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions,
        fetchOptions,
      });
    },
    updateUser: async ({
      name,
      image,
      fetchOptions,
    }: {
      name: string;
      image?: string;
      fetchOptions?: FetchOptions | undefined;
    }) => {
      await authClient.updateUser({
        name,
        image,
        fetchOptions,
      });
    },
    deleteUser: async ({
      password,
      token,
      callbackURL,
      fetchOptions,
    }: {
      password: string;
      token: string;
      callbackURL?: string;
      fetchOptions?: FetchOptions | undefined;
    }) => {
      await authClient.deleteUser({
        password,
        token,
        callbackURL,
        fetchOptions,
      });
    },
  },
};
