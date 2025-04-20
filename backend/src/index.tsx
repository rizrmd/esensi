import type { Server, ServerWebSocket } from "bun";
import index from "frontend/entry/index.html";
import { padEnd } from "lodash";
import {
  c,
  staticFileHandler,
  dir,
  init,
  watchAPI,
  watchPage,
  spaHandler,
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
  const spa = spaHandler({ index, port: 45622 }); //Single Page App Handler
  const handleStatic = staticFileHandler({
    publicDir: "frontend:public",
    cache: isDev ? false : true, // Disable cache in development
    maxAge: isDev ? 0 : 86400, // 1 day cache in production
  });

  for (const [name, site] of Object.entries(config.sites)) {
    servers[name] = Bun.serve({
      port: site.port,
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
        if (req.url.endsWith("/_bun/hmr")) {
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
          site.port
        }${c.reset}`
      );
    }
  }
}
