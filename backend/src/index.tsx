import type { Server } from "bun";
import index from "frontend/entry/index.html";
import { padEnd } from "lodash";
import type { SiteEntry } from "rlib/client";
import {
  buildAPI,
  buildPages,
  c,
  dir,
  init,
  spaHandler,
  staticFileHandler,
  watchAPI,
  watchPage,
} from "rlib/server";
import * as models from "shared/models";
import { backendApi } from "./gen/api";
import { auth } from "./lib/better-auth";

const { isDev, isRestarted, config, routes } = await init({
  root: process.cwd(),
  models,
  backendApi,
});
const apiConfig = {
  input_dir: "backend:src/api",
  out_file: "backend:src/gen/api.ts",
};
const pageConfig = {
  input_dir: "frontend:src/pages",
  out_file: "frontend:src/lib/gen/routes.ts",
};

if (isDev) {
  if (!isRestarted) {
    await buildAPI(apiConfig);
    await buildPages(pageConfig);
  }

  const servers = {} as Record<string, Server>;
  const spa = spaHandler({ index, port: 45622 }); //Single Page App Handler
  const handleStatic = staticFileHandler({
    publicDir: "frontend:public",
    cache: isDev ? false : true, // Disable cache in development
    maxAge: isDev ? 0 : 86400, // 1 day cache in production
  });

  for (const [name, site] of Object.entries(config.sites)) {
    servers[name] = Bun.serve({
      port: site.devPort,
      routes: routes[name],
      websocket: {
        message: (ws, msg) => {
          if (spa.ws.message(ws, msg)) return;
        },
        open: (ws) => {
          if (spa.ws.open(ws)) return;
        },
        close: (ws) => {
          if (spa.ws.close(ws)) return;
        },
      },
      fetch: async (req) => {
        const url = new URL(req.url);

        if (url.pathname.startsWith("/api/auth")) {
          return auth.handler(req);
        }

        if (url.pathname.startsWith("/_bun/hmr")) {
          servers[name]!.upgrade(req, { data: "hmr" });
          return;
        }
        const staticResponse = await handleStatic(req);
        if (staticResponse) {
          return staticResponse;
        }

        return spa.serve(req, servers[name]!);
      },
    });
  }

  if (!isRestarted) {
    console.log(`${c.green}DEV${c.reset} Servers started:`);
    for (const [name, site] of Object.entries(config.sites)) {
      console.log(
        `- ${padEnd(name + " ", 20, "─")} ${c.magenta}http://localhost:${
          site.devPort
        }${c.reset}`
      );
    }

    watchAPI(apiConfig);
    watchPage(pageConfig);
  }
} else {
  // Production mode
  console.log(`${c.blue}PROD${c.reset} Building frontend...`);

  // Run the build script in the frontend folder
  const buildProcess = Bun.spawn(["bun", "run", "build"], {
    cwd: dir.path("frontend:"),
    stdout: "inherit",
    stderr: "inherit",
  });

  const buildExit = await buildProcess.exited;

  if (buildExit !== 0) {
    console.error(
      `${c.red}ERROR${c.reset} Frontend build failed with exit code ${buildExit}`
    );
    process.exit(1);
  }

  console.log(`${c.green}PROD${c.reset} Frontend built successfully`);

  // Setup static file handlers for both public and dist directories
  const handlePublic = staticFileHandler({
    publicDir: "frontend:public",
    cache: true,
    maxAge: 86400, // 1 day cache
  });

  const handleDist = staticFileHandler({
    publicDir: "frontend:dist",
    cache: true,
    maxAge: 86400, // 1 day cache
    spaIndexFile: "index.html",
  });

  // Choose default port - either defined in an environment variable or use 3000
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  // Choose default site (first site in config if no specific default is provided)
  const defaultSiteName =
    process.env.DEFAULT_SITE || Object.keys(config.sites)[0];

  // Define server with proper type
  const server = Bun.serve({
    port,
    fetch: async (req): Promise<Response> => {
      const url = new URL(req.url);
      const host = req.headers.get("host") || "";

      if (url.pathname.startsWith("/api/auth")) {
        return auth.handler(req);
      }

      // Determine which site config to use based on the domain
      let siteName: string | null = null;
      let siteConfig: SiteEntry | null = null;

      for (const [name, site] of Object.entries(config.sites)) {
        if (
          site.domains?.some(
            (domain) => host === domain || host.endsWith(`.${domain}`)
          )
        ) {
          siteName = name;
          siteConfig = site;
          break;
        }
      }

      // If no matching domain found and we have a default site, use that
      if (!siteName && defaultSiteName && config.sites[defaultSiteName]) {
        siteName = defaultSiteName;
        siteConfig = config.sites[defaultSiteName] as any;
      }

      // If we still don't have a site, return 404
      if (!siteName || !siteConfig) {
        return new Response("Domain not configured", { status: 404 });
      }

      // If not a static file, handle API routes if available for this site
      const siteRoutes = siteName ? routes[siteName] : undefined;

      if (siteRoutes && Array.isArray(siteRoutes)) {
        // Find the first route that matches both method and path pattern
        const matchingRoute = siteRoutes.find((r) => {
          if (
            !r ||
            typeof r.pattern !== "string" ||
            typeof r.method !== "string"
          ) {
            return false;
          }
          return r.method === req.method && url.pathname.match(r.pattern);
        });

        if (matchingRoute && typeof matchingRoute.handler === "function") {
          try {
            return await matchingRoute.handler(req);
          } catch (err) {
            console.error(`API error:`, err);
            return new Response("Internal Server Error", { status: 500 });
          }
        }
      }

      // Try to serve static files first
      const staticResponse = await handlePublic(req);
      if (staticResponse) {
        return staticResponse;
      }

      // Then try dist files (built frontend)
      const distResponse = await handleDist(req);
      if (distResponse) {
        return distResponse;
      }
      return new Response("Not Found", { status: 404 });
    },
  });

  console.log(
    `${c.blue}PROD${c.reset} Server started on port ${c.magenta}${port}${c.reset}`
  );
  console.log(`${c.blue}PROD${c.reset} Configured domains:`);

  for (const [name, site] of Object.entries(config.sites)) {
    if (site.domains && site.domains.length > 0) {
      console.log(
        `- ${padEnd(name + " ", 20, "─")} ${c.magenta}${site.domains.join(
          ", "
        )}${c.reset}${
          defaultSiteName === name ? ` (${c.green}default${c.reset})` : ""
        }`
      );
    }
  }
}
