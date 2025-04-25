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
        column: "id_sales_and_marketing",
      },
    }
  },
} as const satisfies ModelDefinition<"sales_and_marketing">;