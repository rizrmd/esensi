import type { ModelDefinition } from "rlib/server";

export default {
  table: "transaction",
  columns: {
    id: {
      type: "text",
    },
    id_publisher: {
      type: "text",
    },
    type: {
      type: "text",
    },
    amount: {
      type: "number",
    },
    created_at: {
      type: "datetime",
    },
    info: {
      type: "json",
    }
  },
  relations: {
    publisher: {
      type: "belongs_to",
      from: "id_publisher",
      to: {
        model: "publisher",
        column: "id",
      },
    }
  },
} as const satisfies ModelDefinition<"transaction">;