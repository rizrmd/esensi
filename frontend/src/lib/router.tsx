import { pageModules } from "@/lib/gen/routes";
import { createContext } from "react";
import raw_config from "../../../config.json";
import { type SiteConfig } from "rlib/client";

const config = raw_config as SiteConfig;

// Normalize basePath to ensure it has trailing slash only if it's not '/'
export const basePath = `${location.protocol}//${location.host}/`;

// Utility for consistent path building
export function buildPath(to: string): string {
  return to.startsWith("/")
    ? basePath === "/"
      ? to
      : `${basePath}${to.slice(1)}`
    : to;
}

// Get domain key by port number when on localhost
export function getDomainKeyByPort(port: string): string | null {
  for (const [domain, cfg] of Object.entries(config.sites)) {
    if (cfg.devPort?.toString() === port) {
      return domain;
    }
  }
  return null;
}

export type Params = Record<string, string>;
export type RoutePattern = {
  pattern: string;
  regex: RegExp;
  paramNames: string[];
};

export const ParamsContext = createContext<Params>({});

// Check if the first part of a path is a domain identifier from config
export function isDomainSegment(segment: string): boolean {
  if (!segment || !segment.includes('.')) return false;

  // Check if this segment matches any site key in config
  return Object.keys(config.sites).some(site => site === segment);
}

export function parsePattern(pattern: string): RoutePattern {
  const paramNames: string[] = [];
  const patternParts = pattern.split("/");
  const regexParts = patternParts.map((part, index) => {
    // If this is the first non-empty part and contains a dot, it might be a domain
    if (index === 1 && part.includes('.') && isDomainSegment(part)) {
      // Treat domain segment literally, escape any special regex characters
      return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Find all parameter patterns like [id] in the part
    const matches = part.match(/\[([^\]]+)\]/g);
    if (matches) {
      let processedPart = part;
      matches.forEach((match) => {
        const paramName = match.slice(1, -1);
        paramNames.push(paramName);
        // Replace [param] with capture group, preserve surrounding text
        processedPart = processedPart.replace(match, "([^/]+)");
      });
      return processedPart;
    }
    return part;
  });

  return {
    pattern,
    regex: new RegExp(`^${regexParts.join("/")}$`),
    paramNames,
  };
}

export function matchRoute(
  path: string,
  routePattern: RoutePattern
): Params | null {
  const pathParts = path.split('/');
  const patternParts = routePattern.pattern.split('/');

  // Check if first non-empty segment is a domain segment
  if (pathParts.length > 1 && patternParts.length > 1) {
    const pathFirstSegment = pathParts[1];
    const patternFirstSegment = patternParts[1];


    // If pattern has a domain segment (contains a dot)
    if (patternFirstSegment.includes('.') && isDomainSegment(patternFirstSegment)) {
      const currentHost = location.host;
      const isLocalhost = currentHost.includes('localhost') || currentHost.includes('127.0.0.1');
      const isFirebaseStudio = currentHost.endsWith('.cloudworkstations.dev')

      // Check if current host matches a domain for this pattern's first segment
      const domainConfig = config.sites[patternFirstSegment as keyof typeof config.sites];
      if (domainConfig) {
        // For localhost, match by port
        if (isFirebaseStudio) {
          const currentPort = currentHost.split('-').shift();
          const expectedPort = domainConfig.devPort?.toString();
          if (expectedPort && currentPort !== expectedPort) {
            return null;
          }
        }
        else if (isLocalhost) {
          // Extract port from current host (localhost:PORT format)
          const currentPort = currentHost.split(':')[1];
          // Check if port matches the config
          const expectedPort = domainConfig.devPort?.toString();

          // If port doesn't match and we have a specific expected port, don't match
          if (expectedPort && currentPort !== expectedPort) {
            return null;
          }
        }
        // For production domains, match by domain name
        else if (domainConfig.domains) {
          // Check if current host matches one of the domains for this pattern
          const matchesDomain = domainConfig.domains.some(domain =>
            currentHost === domain
          );

          // If we're not on a matching domain, don't match
          if (!matchesDomain) {
            return null;
          }
        }
      }
    }
  }

  // Handle hash fragments in the path
  const match = (path.split("#").shift() || "").match(routePattern.regex);
  if (!match) return null;

  const params: Params = {};
  routePattern.paramNames.forEach((name, index) => {
    const matched = match[index + 1];
    if (matched) {
      params[name] = matched;
    }
  });
  return params;
}

export function parseRouteParams(path: string): Params | null {
  for (let pattern in pageModules) {
    const params = matchRoute(path, parsePattern(pattern));
    if (params) {
      return params;
    }
  }
  return null;
}

export function Link({
  href: to,
  children,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  [key: string]: any;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={buildPath(to)} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export const navigate = (to: string) => {
  const fullPath = buildPath(to);
  window.history.pushState({}, "", fullPath);
  window.dispatchEvent(new PopStateEvent("popstate"));
};
