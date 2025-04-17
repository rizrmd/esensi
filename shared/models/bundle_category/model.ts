import type { ModelDefinition } from 'rlib';

export default {
  table: "bundle_category",
  columns: {
    id: {
      type: "text",
    },
    id_category: {
      type: "text",
    },
    id_bundle: {
      type: "text",
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
    category: {
      type: "belongs_to",
      from: "id_category",
      to: {
        model: "category",
        column: "id",
      },
    }
  },
} as const satisfies ModelDefinition<"bundle_category">;