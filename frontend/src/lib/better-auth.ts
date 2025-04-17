import { createAuthClient as authClient } from "better-auth/client";

const { signUp, signIn, signOut } = authClient({
  baseURL: "http://localhost:3000",
});

export default {
  signUp: async ({
    username,
    password,
    name,
    callbackURL = "http://localhost:3000/dashboard",
  }: {
    username: string;
    password: string;
    name?: string;
    callbackURL?: string;
  }) => {
    const { data, error } = await signUp.email({
      email: username,
      password,
      name,
      callbackURL,
    });
    return { data, error };
  },
  signIn: async ({
    username,
    password,
    callbackURL = "http://localhost:3000/dashboard",
    rememberMe,
  }: {
    username: string;
    password: string;
    callbackURL?: string;
    rememberMe?: boolean;
  }) => {
    const { data, error } = await signIn.email(
      {
        email: username,
        password,
        callbackURL,
        rememberMe,
      },
      {
        // onRequest: (ctx) => {
        //   //show loading
        //   console.log('Request', ctx);
        // },
        // onSuccess: (ctx) => {
        //   //redirect to the dashboard or sign in page
        //   console.log('Success', ctx);
        // },
        // onError: (ctx) => {
        //   // display the error message
        //   console.error('Error', ctx);
        // },
      }
    );
    return { data, error };
  },
  signOut: async () => {
    const { data, error } = await signOut();
    return { data, error };
  }
};
