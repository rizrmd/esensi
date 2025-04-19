import type { ModelDefinition } from "rlib/server";

export default {
  table: "customer_reader",
  columns: {
    id: {
      type: "text",
    },
    id_customer: {
      type: "text",
    },
    id_product: {
      type: "text",
    },
    last_page: {
      type: "number",
    },
    percent: {
      type: "number",
    }
  },
  relations: {
    customer: {
      type: "belongs_to",
      from: "id_customer",
      to: {
        model: "customer",
        column: "id",
      },
    },
    product: {
      type: "belongs_to",
      from: "id_product",
      to: {
        model: "product",
        column: "id",
      },
    }
  },
} as const satisfies ModelDefinition<"customer_reader">;