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

const config = raw_config as any;

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
      
      // Check if we're on localhost and requesting the root path
      const isLocalhost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
      const isRootPath = path === '/';
      
      // For root path on localhost, use the domain key from the port to redirect
      if (isLocalhost && isRootPath) {
        const port = window.location.port;
        const domainKey = getDomainKeyByPort(port);
        
        // If we found a domain key for this port and it's not the default domain
        if (domainKey && domainKey !== 'default') {
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
      }

      // Continue with normal routing logic if domain-specific handling didn't succeed
      // Try exact match first
      let pageLoader = pageModules[path];
      let matchedParams = {};

      // If no exact match, check if we're on localhost with a specific port
      if (!pageLoader) {
        const isLocalhost = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1';
        
        if (isLocalhost) {
          const port = window.location.port;
          const domainKey = getDomainKeyByPort(port);
          
          if (domainKey) {
            // Try to match with domain-specific route
            const domainPath = `/${domainKey}${path}`;
            const domainPageLoader = pageModules[domainPath];
            
            if (domainPageLoader) {
              // We found a match for domain-specific path
              pageLoader = domainPageLoader;
              matchedParams = {};
            }
          }
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
