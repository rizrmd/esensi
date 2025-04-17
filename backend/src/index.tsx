import { serve } from "bun";
import index from "frontend/index.html";
import { c, init, watchAPI } from "rlib";
import * as models from "shared/models";

const { isDEV } = await init({ root: process.cwd(), models });

const test = await db.user.findMany({limit:1})
console.log("test", test);

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
        const res= await db.bundle.findMany({ limit: 1 })
        console.log(res);

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
