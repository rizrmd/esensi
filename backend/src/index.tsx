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
  const assetServer = Bun.serve({
    static: {
      "/*": index,
    },
    fetch() {
      return new Response(null, { status: 404 });
    },
    port: 45622,
  });
  const handleStatic = staticFileHandler({
    publicDir: "frontend:public",
    cache: isDev ? false : true, // Disable cache in development
    maxAge: isDev ? 0 : 86400, // 1 day cache in production
  });

  for (const [name, site] of Object.entries(config.sites)) {
    // Create static file handler

    const hmr = new WeakMap<ServerWebSocket<unknown>, WebSocket>();
    servers[name] = Bun.serve({
      port: site.port,
      routes: routes[name],
      websocket: {
        message: (ws, msg) => {
          if (ws.data === "hmr") {
            const sw = hmr.get(ws);
            if (sw) {
              sw.send(msg);
            }
          }
        },
        open: (ws) => {
          console.log(ws.data);
          if (ws.data === "hmr") {
            const sw = new WebSocket("ws://localhost:45622/_bun/hmr");
            sw.onmessage = (e) => {
              ws.send(e.data as any);
            };
            sw.onclose = () => {
              hmr.delete(ws);
            };
            hmr.set(ws, sw as any);
          }
        },
        close: (ws) => {
          if (ws.data === "hmr") {
            hmr.delete(ws);
          }
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
