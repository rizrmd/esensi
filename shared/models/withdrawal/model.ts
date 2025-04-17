import type { ModelDefinition } from 'rlib';

export default {
  table: "withdrawal",
  columns: {
    id: {
      type: "text",
    },
    id_publisher: {
      type: "text",
    },
    amount: {
      type: "number",
    },
    status: {
      type: "text",
    },
    requested_at: {
      type: "datetime",
    },
    processed_at: {
      type: "datetime",
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
} as const satisfies ModelDefinition<"withdrawal">;