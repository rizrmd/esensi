import type { ModelDefinition } from "rlib/server";

export default {
  table: "t_ai_credit",
  columns: {
    id: {
      type: "text",
    },
    id_publisher: {
      type: "text",
    },
    balance: {
      type: "number",
    },
    last_topup_at: {
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
    },
    ai_credit_topups: {
      type: "has_many",
      from: "id",
      to: {
        model: "t_ai_credit_topup",
        column: "id_t_ai_credit",
      },
    }
  },
} as const satisfies ModelDefinition<"t_ai_credit">;