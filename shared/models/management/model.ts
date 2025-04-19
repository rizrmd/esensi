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
    user: {
      type: "belongs_to",
      from: "id_user",
      to: {
        model: "user",
        column: "id",
      },
    },
    user_infos: {
      type: "has_many",
      from: "id",
      to: {
        model: "user_info",
        column: "id_management",
      },
    }
  },
} as const satisfies ModelDefinition<"management">;