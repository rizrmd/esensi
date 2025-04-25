import type { ModelDefinition } from "rlib/server";

export default {
  table: "auth_two_factor",
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
} as const satisfies ModelDefinition<"auth_two_factor">;