import type { ModelDefinition } from "rlib/server";

export default {
  table: "management",
  columns: {
    id: {
      type: "text",
    },
    name: {
      type: "text",
    },
    id_user: {
      type: "text",
    }
  },
  relations: {
    auth_account: {
      type: "belongs_to",
      from: "id_user",
      to: {
        model: "auth_account",
        column: "id",
      },
    },
    auth_users: {
      type: "has_many",
      from: "id",
      to: {
        model: "auth_user",
        column: "id_management",
      },
    }
  },
} as const satisfies ModelDefinition<"management">;