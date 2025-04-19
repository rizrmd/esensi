import type { Server } from "bun";
import index from "frontend/entry/index.html";
import { padEnd } from "lodash";
import { c, init, watchAPI, watchPage } from "rlib/server";
import * as models from "shared/models";
import { backendApi } from "./gen/api";

const { isDev, isRestarted, config, routes } = await init({
  root: process.cwd(),
  models,
  backendApi,
  index,
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
  for (const [name, site] of Object.entries(config.sites)) {
    servers[name] = Bun.serve({
      port: site.port,
      routes: routes[name],
      fetch(req) {
        return new Response("Not Found", { status: 404 });
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
