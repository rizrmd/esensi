import type { ModelDefinition } from 'rlib';

export default {
  table: "bundle_product",
  columns: {
    id_bundle: {
      type: "text",
    },
    id_product: {
      type: "text",
    },
    id: {
      type: "text",
    },
    qty: {
      type: "number",
    }
  },
  relations: {
    bundle: {
      type: "belongs_to",
      from: "id_bundle",
      to: {
        model: "bundle",
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
} as const satisfies ModelDefinition<"bundle_product">;