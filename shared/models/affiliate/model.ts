import type { ModelDefinition } from "rlib/server";

export default {
  table: "affiliate",
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
    user: {
      type: "belongs_to",
      from: "id_user",
      to: {
        model: "user",
        column: "id",
      },
    },
    user_roles: {
      type: "has_many",
      from: "id",
      to: {
        model: "user_role",
        column: "id_affiliate",
      },
    }
  },
} as const satisfies ModelDefinition<"affiliate">;