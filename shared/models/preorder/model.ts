import type { ModelDefinition } from 'rlib';

export default {
  table: "preorder",
  columns: {
    id: {
      type: "text",
    },
    id_product: {
      type: "text",
    },
    min_qty: {
      type: "number",
    },
    current_qty: {
      type: "number",
    },
    status: {
      type: "text",
    },
    deadline: {
      type: "datetime",
    }
  },
  relations: {
    product: {
      type: "belongs_to",
      from: "id_product",
      to: {
        model: "product",
        column: "id",
      },
    }
  },
} as const satisfies ModelDefinition<"preorder">;