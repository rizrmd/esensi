import type { ModelDefinition } from "rlib/server";

export default {
  table: "session",
  columns: {
    id: {
      type: "text",
    },
    expires_at: {
      type: "datetime",
    },
    token: {
      type: "text",
    },
    created_at: {
      type: "datetime",
    },
    updated_at: {
      type: "datetime",
    },
    ip_address: {
      type: "text",
    },
    user_agent: {
      type: "text",
    },
    user_info_id: {
      type: "text",
    }
  },
  relations: {
    user_info: {
      type: "belongs_to",
      from: "user_info_id",
      to: {
        model: "user_info",
        column: "id",
      },
    }
  },
} as const satisfies ModelDefinition<"session">;