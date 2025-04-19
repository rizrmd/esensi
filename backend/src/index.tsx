import type { Server } from "bun";
import index from "frontend/entry/index.html";
import { padEnd } from "lodash";
import {
  c,
  staticFileHandler,
  dir,
  init,
  watchAPI,
  watchPage,
} from "rlib/server";
import * as models from "shared/models";
import { backendApi } from "./gen/api";

const { isDev, isRestarted, config, routes } = await init({
  root: process.cwd(),
  models,
  backendApi,
});

if (isDev) {
  if (!isRestarted) {
    watchAPI({
      input_dir: "backend:src/api",
      out_file: "backend:src/gen/api.ts",
    });
    watchPage({
      input_dir: "frontend:src/pages",
      out_file: "frontend:src/lib/gen/routes.ts",
    });
  }
}

if (isDev) {
  const servers = {} as Record<string, Server>;
  const publicFiles = dir.path("frontend:public");

  const assetServer = Bun.serve({
    static: {
      "/*": index,
    },
    fetch() {
      return new Response(null, { status: 404 });
    },
    port: 45622,
  });

  for (const [name, site] of Object.entries(config.sites)) {
    // Create static file handler
    const handleStatic = staticFileHandler({
      publicDir: "frontend:public",
      cache: isDev ? false : true, // Disable cache in development
      maxAge: isDev ? 0 : 86400, // 1 day cache in production
    });

    servers[name] = Bun.serve({
      port: site.port,
      routes: routes[name],
      fetch: async (req) => {
        const staticResponse = await handleStatic(req);
        if (staticResponse) {
          return staticResponse;
        }

        return fetch(
          new URL(
            req.url.slice(servers[name]!.url.href.length),
            assetServer.url
          )
        );
      },
    });
  }
  if (!isRestarted) {
    console.log(`${c.green}DEV${c.reset} Servers started:`);
    for (const [name, site] of Object.entries(config.sites)) {
      console.log(
        `- ${padEnd(name + " ", 20, "─")} ${c.magenta}http://localhost:${
          site.port
        }${c.reset}`
      );
    }
  }
}
