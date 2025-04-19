import type { ModelDefinition } from "rlib/server";

export default {
  table: "product_category",
  columns: {
    id_product: {
      type: "text",
    },
    id_category: {
      type: "text",
    },
    id: {
      type: "text",
    }
  },
  relations: {
    category: {
      type: "belongs_to",
      from: "id_category",
      to: {
        model: "category",
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
} as const satisfies ModelDefinition<"product_category">;