import type { ModelDefinition } from "rlib/server";

export default {
  table: "verification",
  columns: {
    id: {
      type: "text",
    },
    identifier: {
      type: "text",
    },
    value: {
      type: "text",
    },
    expires_at: {
      type: "datetime",
    },
    created_at: {
      type: "datetime",
    },
    updated_at: {
      type: "datetime",
    }
  },
  relations: {},
} as const satisfies ModelDefinition<"verification">;