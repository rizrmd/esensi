import type { ModelDefinition } from "rlib/server";

export default {
  table: "two_factor",
  columns: {
    id: {
      type: "text",
    },
    secret: {
      type: "text",
    },
    backup_codes: {
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
} as const satisfies ModelDefinition<"two_factor">;