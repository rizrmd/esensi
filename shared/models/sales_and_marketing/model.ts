import type { ModelDefinition } from "rlib/server";

export default {
  table: "sales_and_marketing",
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
        column: "id_sales_and_marketing",
      },
    }
  },
} as const satisfies ModelDefinition<"sales_and_marketing">;