import { serve } from "bun";
import index from "frontend/index.html";
import { c, defineDB, dir, watchAPI } from "rlib";
import * as models from "shared/models";
import { join } from "path";

dir.root = join(process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Please set it in your environment variables."
  );
}

const db = await defineDB(models, process.env.DATABASE_URL!);
const isDEV = process.argv.includes("--dev");

if (isDEV) {
  watchAPI({
    input_dir: "backend:src/api",
    out_file: "backend:src/gen/api.ts",
  });
}

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(
  `🚀 Running ${
    isDEV ? `${c.green}DEV${c.reset}` : `${c.blue}PROD${c.reset}`
  } at ${server.url}`
);
