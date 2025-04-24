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
    id_user_role: {
      type: "text",
    }
  },
  relations: {
    user_role: {
      type: "belongs_to",
      from: "id_user_role",
      to: {
        model: "user_role",
        column: "id",
      },
    }
  },
} as const satisfies ModelDefinition<"session">;