import type { ModelDefinition } from "rlib/server";

export default {
  table: "midtrx",
  columns: {
    id: {
      type: "text",
    },
    tz: {
      type: "datetime",
    },
    type: {
      type: "text",
    },
    payload: {
      type: "json",
    }
  },
  relations: {},
} as const satisfies ModelDefinition<"midtrx">;