import type * as models from "shared/models";
import type { defineDB, ModelOperations } from "rlib";

declare global {
  const db = await defineDB(models);
}
