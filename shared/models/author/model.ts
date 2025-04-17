import type { ModelDefinition } from 'rlib';

export default {
  table: "author",
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
    products: {
      type: "has_many",
      from: "id",
      to: {
        model: "product",
        column: "id_author",
      },
    }
  },
} as const satisfies ModelDefinition<"author">;