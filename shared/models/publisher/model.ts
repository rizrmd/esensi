import type { ModelDefinition } from "rlib/server";

export default {
  table: "publisher",
  columns: {
    id: {
      type: "text",
    },
    id_user: {
      type: "text",
    },
    name: {
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
    promo_codes: {
      type: "has_many",
      from: "id",
      to: {
        model: "promo_code",
        column: "id_publisher",
      },
    },
    publisher_authors: {
      type: "has_many",
      from: "id",
      to: {
        model: "publisher_author",
        column: "publisher_id",
      },
    },
    ai_credits: {
      type: "has_many",
      from: "id",
      to: {
        model: "t_ai_credit",
        column: "id_publisher",
      },
    },
    transactions: {
      type: "has_many",
      from: "id",
      to: {
        model: "transaction",
        column: "id_publisher",
      },
    },
    user_infos: {
      type: "has_many",
      from: "id",
      to: {
        model: "user_info",
        column: "id_publisher",
      },
    },
    withdrawals: {
      type: "has_many",
      from: "id",
      to: {
        model: "withdrawal",
        column: "id_publisher",
      },
    }
  },
} as const satisfies ModelDefinition<"publisher">;