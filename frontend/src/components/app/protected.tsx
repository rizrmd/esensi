import { betterAuth, type User } from "@/lib/better-auth";
import { useLocal } from "@/lib/hooks/use-local";
import { Link, navigate } from "@/lib/router";
import type { FC, ReactNode } from "react";
import { Alert } from "../ui/global-alert";
import { AppLoading } from "./loading";

export type Role =
  | "publisher"
  | "author"
  | "sales_and_marketing"
  | "customer"
  | "support"
  | "affiliate"
  | "management";
export const Protected: FC<{
  children: ReactNode | ((opt: { user: User | null }) => ReactNode);
  role?: Role | Role[] | "any";
  onLoad?: (opt: { user: null | User }) => void;
  fallback?: (opt: { role: string[] }) => ReactNode;
  redirecURLtIfNotLoggedIn?: string | null;
}> = ({ children, role, fallback, onLoad, redirecURLtIfNotLoggedIn }) => {
  const local = useLocal(
    {
      loading: true,
      user: null as User | null,
      missing_role: [] as string[],
    },
    async () => {
      try {
        const res = await betterAuth.getSession();

        if (res.session) {
          if (role !== "any") {
            const roles = Array.isArray(role) ? role : [role];
            const u = res.session.user;
            local.missing_role = [];
            for (const r of roles) {
              if ((u as any)[`id_${r}`]) {
              } else {
                if (r) local.missing_role.push(r);
              }
            }

            if (roles.length > 0 && local.missing_role.length < roles.length) {
              local.missing_role = [];
            }
          }

          if (!res.error) {
            local.user = res.session!.user;
            local.render();
          } else {
            Alert.info(res.error);
          }
        }

        if (onLoad) {
          onLoad({ user: local.user });
        }

        local.loading = false;
        local.render();
      } catch (e) {
        console.error(e);
      }
    }
  );

  if (local.loading) return <AppLoading />;

  if (!!redirecURLtIfNotLoggedIn && !local.user) {
    navigate(redirecURLtIfNotLoggedIn);
  }
  if (local.missing_role.length > 0) {
    if (fallback) return fallback({ role: local.missing_role });
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[400px] py-12 space-y-4 md:space-y-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter text-center">
            Mohon Maaf
            <br /> Anda tidak memiliki akses.
          </h1>
          <div className="inline-flex items-center justify-center rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <img src="/img/forbidden.svg" />
          </div>
          <p className="max-w-[600px] text-center text-gray-500 md:text-xl/relaxed dark:text-gray-400">
            Role yang anda miliki tidak sesuai dengan role yang dibutuhkan untuk
            mengakses halaman ini.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800  dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
        >
          Kembali ke halaman awal
        </Link>
      </div>
    );
  }

  return (
    <>
      {typeof children === "function"
        ? children({ user: local.user })
        : children}
    </>
  );
};
