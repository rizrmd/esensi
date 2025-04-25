import type { ModelDefinition } from "rlib/server";

export default {
  table: "auth_session",
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
    id_user: {
      type: "text",
    }
  },
  relations: {
    auth_user: {
      type: "belongs_to",
      from: "id_user",
      to: {
        model: "auth_user",
        column: "id",
      },
    }
  },
} as const satisfies ModelDefinition<"auth_session">;