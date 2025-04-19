import type { ModelDefinition } from "rlib/server";

export default {
  table: "t_ai_credit_topup",
  columns: {
    id: {
      type: "text",
    },
    id_t_ai_credit: {
      type: "text",
    },
    amount: {
      type: "number",
    },
    created_at: {
      type: "datetime",
    },
    status: {
      type: "text",
    }
  },
  relations: {
    ai_credit: {
      type: "belongs_to",
      from: "id_t_ai_credit",
      to: {
        model: "t_ai_credit",
        column: "id",
      },
    }
  },
} as const satisfies ModelDefinition<"t_ai_credit_topup">;