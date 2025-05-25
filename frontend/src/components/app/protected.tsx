import { betterAuth, type User } from "@/lib/better-auth";
import { baseUrl } from "@/lib/gen/base-url";
import { useLocal } from "@/lib/hooks/use-local";
import { Link, navigate } from "@/lib/router";
import { snakeToCamel } from "@/lib/utils";
import { css } from "goober";
import type { FC, ReactNode } from "react";
import { Button } from "../ui/button";
import { Alert } from "../ui/global-alert";
import { AppLoading } from "./loading";

export const current = {
  user: null as User | null,
  iframe: null as HTMLIFrameElement | null,
  signoutCallback: undefined as undefined | (() => void),
};

export type Role =
  | "affiliate"
  | "author"
  | "customer"
  | "internal"
  | "publisher";

export const Protected: FC<{
  children:
    | ReactNode
    | ((opt: { user: User | null; missing_role: string[] }) => ReactNode);
  role?: Role | Role[] | "any";
  onLoad?: (opt: { user: null | User }) => void | Promise<void>;
  fallback?: (opt: { missing_role: string[] }) => ReactNode;
  fallbackUrl?: string | null;
}> = ({ children, role, fallback, onLoad, fallbackUrl }) => {
  const params = new URLSearchParams(location.search);
  let callbackURL = params.get("callbackURL") as string | undefined;
  callbackURL = !callbackURL ? window.location.origin : callbackURL;

  const local = useLocal(
    {
      loading: true,
      loaded: false,
      missing_role: [] as string[],
    },
    async () => {
      current.iframe = document.getElementById(
        "session-frame"
      ) as HTMLIFrameElement | null;
      if (!current.iframe) {
        current.iframe = document.createElement("iframe");
        current.iframe.id = "session-frame";
        current.iframe.src = baseUrl.auth_esensi + "/api/get-session";
        current.iframe.style.display = "none";
        document.body.appendChild(current.iframe);
      } else {
        local.loading = false;
        local.render();
      }

      window.addEventListener("message", (e) => {
        if (e.data?.action == "signout") {
          if (current.signoutCallback) current.signoutCallback();
          current.signoutCallback = undefined;
        }
        if (e.data?.action == "session") {
          current.user = e.data.user;
          if (!current.user) navigate("/");
          else {
            if (current.user["idAffiliate"] === "null")
              current.user["idAffiliate"] = null;
            if (current.user["idAuthor"] === "null")
              current.user["idAuthor"] = null;
            if (current.user["idCustomer"] === "null")
              current.user["idCustomer"] = null;
            if (current.user["idInternal"] === "null")
              current.user["idInternal"] = null;
            if (current.user["idPublisher"] === "null")
              current.user["idPublisher"] = null;

            if (role !== "any") {
              const roles = Array.isArray(role) ? role : [role];
              local.missing_role = [];
              for (const r of roles) {
                if (!(current.user as any)[snakeToCamel(`id_${r}`)]) {
                  if (r) local.missing_role.push(r);
                }
              }
              if (roles.length > 0 && local.missing_role.length < roles.length)
                local.missing_role = [];
            }

            if (!current.user) Alert.info("Error loading session");
            if (onLoad) {
              if (!local.loaded) local.loaded = true;
              onLoad({ user: current.user });
            }
          }

          local.loading = false;
          local.render();
        }
      });
    }
  );

  if (local.loading) return <AppLoading />;

  if (!!fallbackUrl && !current.user) navigate(fallbackUrl);
  if (local.missing_role.length > 0) {
    if (fallbackUrl) {
      navigate(fallbackUrl);
      return;
    }
    if (fallback) {
      const result = fallback({ missing_role: local.missing_role });
      if (result) return result;
    }
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[400px] py-12 space-y-4 md:space-y-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter text-center">
            Mohon Maaf
            <br /> Anda tidak memiliki akses.
          </h1>
          <div className="inline-flex items-center justify-center rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <img
              src="/img/forbidden.svg"
              className={css`
                max-height: 300px;
              `}
            />
          </div>
          <div>
            Anda tidak memiliki hak akses
            <br /> untuk halaman ini
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800  dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
          >
            Kembali ke halaman awal
          </Link>
          <div>atau</div>
          <Button
            onClick={async () => {
              await betterAuth.signOut();
              navigate("/");
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {typeof children === "function"
        ? children({ user: current.user, missing_role: local.missing_role })
        : children}
    </>
  );
};
