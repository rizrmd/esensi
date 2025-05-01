import {
  initDev,
  initEnv,
  initProd,
  type onFetch,
  type SiteConfig,
} from "rlib/server";
import { auth } from "./lib/better-auth";

const { isDev } = initEnv();

const loadModels = async () => {
  return new (await import("shared/models")).PrismaClient();
};
const loadApi = async () => {
  return (await import("./gen/api")).backendApi;
};
const onFetch: onFetch = async ({ url, req }) => {
  if (url.pathname.startsWith("/api/auth")) {
    try {
      return await auth.handler(req);
    } catch (e) {
      throw e;
    }
  }
};

if (isDev) {
  const index = (await import("frontend/entry/index.html")).default;
  initDev({
    index,
    loadApi,
    loadModels,
    onFetch,
  });
} else {
  const config = (await import("../../config.json")) as SiteConfig;
  initProd({
    loadApi,
    loadModels,
    onFetch,
    config,
  });
}
