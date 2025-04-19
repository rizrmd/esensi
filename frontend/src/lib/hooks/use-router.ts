import { pageModules } from "@/lib/gen/routes";
import {
  basePath,
  matchRoute,
  ParamsContext,
  parsePattern,
  type Params,
} from "@/lib/router";
import { useContext, useEffect, type FC, type ReactNode } from "react";
import { useLocal } from "../hooks/use-local";

const router = {
  currentPath: window.location.pathname,
  currentFullPath: window.location.pathname + window.location.hash,
  params: {} as Params,
};

export function useRoot() {
  const local = useLocal({
    Page: null as React.ComponentType | null,
    routePath: "",
  });
  useEffect(() => {
    const handlePathChange = () => {
      router.currentPath = window.location.pathname;
      router.currentFullPath = window.location.pathname + window.location.hash;
      setTimeout(local.render);
    };

    window.addEventListener("popstate", handlePathChange);
    return () => window.removeEventListener("popstate", handlePathChange);
  }, []);

  useEffect(() => {
    const logRouteChange = async (path: string) => {
      // api.logRoute(path, user?.id);
    };

    const loadPage = async () => {
      // Always strip basePath if it exists, since the route definitions don't include it
      const withoutBase =
        basePath !== "/" && router.currentPath.startsWith(basePath)
          ? router.currentPath.slice(basePath.length)
          : router.currentPath;
      // Ensure path starts with slash and handle trailing slashes
      const path =
        (withoutBase.startsWith("/") ? withoutBase : "/" + withoutBase).replace(
          /\/$/,
          ""
        ) || "/";

      await logRouteChange(path);

      // Try exact match first
      let pageLoader = pageModules[path];
      let matchedParams = {};

      // If no exact match, try parameterized routes
      if (!pageLoader) {
        for (const [pattern, loader] of Object.entries(pageModules)) {
          const routePattern = parsePattern(pattern);
          const params = matchRoute(path, routePattern);
          if (params) {
            pageLoader = loader;
            matchedParams = params;
            break;
          }
        }
      }

      if (pageLoader) {
        try {
          const module = await pageLoader();
          local.routePath = path;
          local.Page = module.default;
          router.params = matchedParams;
          local.render();
        } catch (err) {
          console.error("Failed to load page:", err);
          local.Page = null;
          local.routePath;
          router.params = {};
          local.render();
        }
      } else {
        // Load 404 page
        try {
          const module = await pageModules["/404"]?.();
          local.routePath = path;
          local.Page = module.default;
          router.params = {};
          local.render();
        } catch {
          local.Page = null;
          local.routePath = "";
          router.params = {};
          local.render();
        }
      }
    };

    loadPage();
  }, [router.currentPath]);

  return {
    Page: local.Page ? local.Page : null,
    currentPath: router.currentPath,
    params: router.params,
    // isLoading: auth.status === "loading",
  };
}

export function useRouter() {
  return router;
}

export function useParams<T extends Record<string, string>>() {
  return {
    params: useContext(ParamsContext) as T,
    hash: {} as Record<string, string>,
  };
}

export const AuthRoute: FC<{ children: ReactNode }> = ({ children }) => {
  return children;
};
