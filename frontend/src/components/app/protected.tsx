import { baseUrl } from "@/lib/gen/base-url";
import { useLocal } from "@/lib/hooks/use-local";
import { notif } from "@/lib/notif";
import { navigate } from "@/lib/router";
import { snakeToCamel } from "@/lib/utils";
import type { User } from "backend/lib/better-auth";
import type { Role } from "backend/lib/types";
import type { FC, ReactNode } from "react";
import NoAccess from "../ext/no-access";
import { Alert } from "../ui/global-alert";
import { AppLoading } from "./loading";

export const current = {
  user: null as User | null,
  iframe: null as HTMLIFrameElement | null,
  signoutCallback: undefined as undefined | (() => void),
};

export const Protected: FC<{
  children:
    | ReactNode
    | ((opt: { user: User | null; missing_role: string[] }) => ReactNode);
  role?: Role | Role[] | "any";
  onLoad?: (opt: { user: null | User }) => void | Promise<void>;
  fallback?: (opt: { missing_role: Role[] }) => ReactNode;
  fallbackUrl?: string | null;
}> = ({ children, role, fallback, onLoad, fallbackUrl }) => {
  const params = new URLSearchParams(location.search);
  let callbackURL = params.get("callbackURL") as string | undefined;
  callbackURL = !callbackURL ? window.location.origin : callbackURL;

  const local = useLocal(
    {
      loading: true,
      loaded: false,
      missing_role: [] as Role[],
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
            notif.init(current.user.id);

            if (current.user.idAffiliate === "null")
              current.user.idAffiliate = null;
            if (current.user.idAuthor === "null") current.user.idAuthor = null;
            if (current.user.idCustomer === "null")
              current.user.idCustomer = null;
            if (current.user.idInternal === "null")
              current.user.idInternal = null;
            if (current.user.idPublisher === "null")
              current.user.idPublisher = null;

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
    return <NoAccess />;
  }

  return (
    <>
      {typeof children === "function"
        ? children({ user: current.user, missing_role: local.missing_role })
        : children}
    </>
  );
};
