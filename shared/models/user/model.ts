import type { ModelDefinition } from 'rlib';

export default {
  table: "user",
  columns: {
    id: {
      type: "text",
    },
    username: {
      type: "text",
    },
    password: {
      type: "text",
    },
    role: {
      type: "text",
    }
  },
  relations: {
    authors: {
      type: "has_many",
      from: "id",
      to: {
        model: "author",
        column: "id_user",
      },
    }
  },
} as const satisfies ModelDefinition<"user">;