import { pageModules } from "@/lib/gen/routes";
import {
  basePath,
  getDomainKeyByPort,
  matchRoute,
  ParamsContext,
  parsePattern,
  type Params,
} from "@/lib/router";
import { useContext, useEffect, type FC, type ReactNode } from "react";
import { useLocal } from "../hooks/use-local";
import raw_config from "../../../../config.json";

interface SiteConfig {
  domains?: string[];
  [key: string]: any;
}

interface Config {
  sites: Record<string, SiteConfig>;
  [key: string]: any;
}

const config = raw_config as Config;

// Get domain key from hostname (for non-localhost environments)
function getDomainKeyByHostname(hostname: string): string | null {
  // Based on config.json, when visiting publish.esensi.local, we should return "auth.esensi"
  if (
    hostname === "publish.esensi.local" ||
    hostname === "publish.esensi.online"
  ) {
    return "auth.esensi";
  }

  // For other domains, check the normal mappings
  for (const [domain, cfg] of Object.entries(config.sites)) {
    if (cfg.domains && Array.isArray(cfg.domains)) {
      if (cfg.domains.includes(hostname)) {
        return domain;
      }
    }
  }
  return null;
}

const router = {
  currentPath: window.location.pathname,
  currentFullPath: window.location.pathname + window.location.hash,
  params: {} as Params,
};

export function useRoot() {
  const local = useLocal({
    Page: null as React.ComponentType | null,
    routePath: "",
    isLoading: true,
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

      const hostname = window.location.hostname;
      const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
      const isRootPath = path === "/";
      let domainKey: null | string = null;

      // Determine the domain key based on environment
      if (isLocalhost) {
        // For localhost, use port number to determine domain
        const port = window.location.port;
        domainKey = getDomainKeyByPort(port);
      } else {
        // For non-localhost, use hostname to determine domain
        domainKey = getDomainKeyByHostname(hostname);
      }

      // If we're at the root path and we've identified a domain key,
      // try to load the domain-specific index page
      if (isRootPath && domainKey) {
        // Construct the path to the domain's index page
        const domainIndexPath = `/${domainKey}`;

        // Check if this domain has an index page module
        const domainPageLoader = pageModules[domainIndexPath];

        if (domainPageLoader) {
          try {
            // Load the domain-specific index module
            const module = await domainPageLoader();
            local.routePath = domainIndexPath;
            local.Page = module.default;
            router.params = {};
            local.isLoading = false;
            local.render();
            return;
          } catch (err) {
            console.error(`Failed to load ${domainKey} index page:`, err);
          }
        }
      }

      // If we're not at root path but have a domain key, try to append it to the route
      if (!isRootPath && domainKey && !path.includes(domainKey)) {
        // Construct a path with domain key included
        const domainPath = `/${domainKey}${path}`;
        const domainPageLoader = pageModules[domainPath];

        if (domainPageLoader) {
          try {
            // Load the domain-specific page
            const module = await domainPageLoader();
            local.routePath = domainPath;
            local.Page = module.default;
            router.params = {};
            local.isLoading = false;
            local.render();
            return;
          } catch (err) {
            console.error(`Failed to load ${domainKey} page at ${path}:`, err);
          }
        }
      }

      // Continue with normal routing logic if domain-specific handling didn't succeed
      // Try exact match first
      let pageLoader = pageModules[path];
      let matchedParams = {};

      // If no exact match, check if we're on localhost with a specific port
      if (!pageLoader && domainKey) {
        // Try to match with domain-specific route
        const domainPath = `/${domainKey}${path}`;
        const domainPageLoader = pageModules[domainPath];

        if (domainPageLoader) {
          // We found a match for domain-specific path
          pageLoader = domainPageLoader;
          matchedParams = {};
        }
      }

      // If still no match, try parameterized routes
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
          local.isLoading = false;
          local.render();
        } catch (err) {
          console.error("Failed to load page:", err);
          local.Page = null;
          local.routePath = "";
          router.params = {};
          local.isLoading = false;
          local.render();
        }
      } else {
        // Load 404 page
        try {
          const module = await pageModules["/404"]?.();
          local.routePath = path;
          local.Page = module.default;
          router.params = {};
          local.isLoading = false;
          local.render();
        } catch {
          local.Page = null;
          local.routePath = "";
          router.params = {};
          local.isLoading = false;
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
    isLoading: local.isLoading,
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
