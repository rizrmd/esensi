import { useLocal } from "@/lib/hooks/use-local";
import type { FC, ReactNode } from "react";
import { AppLoading } from "./loading";
import { betterAuth, type User } from "@/lib/better-auth";
import { Alert } from "../ui/global-alert";

export type Role = "publisher" | "author" | "finance" | "customer";
export const Protected: FC<{
  children: ReactNode | ((opt: { user: User | null }) => ReactNode);
  role?: Role | Role[];
}> = ({ children }) => {
  const local = useLocal(
    {
      loading: true,
      user: null as User | null,
    },
    async () => {
      try {
        const res = await betterAuth.getSession();

        if (!res.error) {
          local.user = res.session!.user;
          local.render();
        } else {
          Alert.info(res.error);
        }
        local.loading = false;
        local.render();
      } catch (e) {
        console.error(e);
      }
    }
  );

  if (local.loading) return <AppLoading />;

  return (
    <>
      {typeof children === "function"
        ? children({ user: local.user })
        : children}
    </>
  );
};
