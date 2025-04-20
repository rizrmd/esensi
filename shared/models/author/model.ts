import type { ModelDefinition } from "rlib/server";

export default {
  table: "author",
  columns: {
    id: {
      type: "text",
    },
    name: {
      type: "text",
    },
    id_user: {
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
    },
    publisher_authors: {
      type: "has_many",
      from: "id",
      to: {
        model: "publisher_author",
        column: "author_id",
      },
    },
    user_roles: {
      type: "has_many",
      from: "id",
      to: {
        model: "user_role",
        column: "id_author",
      },
    }
  },
} as const satisfies ModelDefinition<"author">;