import type { ModelDefinition } from 'rlib';

export default {
  table: "category",
  columns: {
    id: {
      type: "text",
    },
    name: {
      type: "text",
    },
    id_parent: {
      type: "text",
    },
    deleted_at: {
      type: "datetime",
    },
    slug: {
      type: "text",
    },
    img: {
      type: "text",
    }
  },
  relations: {
    category: {
      type: "belongs_to",
      from: "id_parent",
      to: {
        model: "category",
        column: "id",
      },
    },
    bundle_categorys: {
      type: "has_many",
      from: "id",
      to: {
        model: "bundle_category",
        column: "id_category",
      },
    },
    categorys: {
      type: "has_many",
      from: "id",
      to: {
        model: "category",
        column: "id_parent",
      },
    },
    product_categorys: {
      type: "has_many",
      from: "id",
      to: {
        model: "product_category",
        column: "id_category",
      },
    }
  },
} as const satisfies ModelDefinition<"category">;