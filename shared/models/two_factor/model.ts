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
    user_info_id: {
      type: "text",
    }
  },
  relations: {
    user_role: {
      type: "belongs_to",
      from: "user_info_id",
      to: {
        model: "user_role",
        column: "id",
      },
    }
  },
} as const satisfies ModelDefinition<"two_factor">;