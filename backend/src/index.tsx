import { initDev, initEnv, initProd, type onFetch } from "rlib/server";
import { auth } from "./lib/better-auth";

const { isDev } = initEnv();

const loadModels = async () => {
  return await import("shared/models");
};
const loadApi = async () => {
  return await import("./gen/api");
};
const onFetch: onFetch = async ({ url, req }) => {
  if (url.pathname.startsWith("/api/auth")) {
    return await auth.handler(req);
  }
};

if (isDev) {
  const index = (await import("frontend/entry/index.html")).default;
  // console.log('xxxx', testEmail());
  initDev({
    index,
    loadApi,
    loadModels,
    onFetch,
  });
} else {
  initProd({
    loadApi,
    loadModels,
    onFetch,
  });
}
