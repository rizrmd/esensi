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
    id_account: {
      type: "text",
    }
  },
  relations: {
    auth_account: {
      type: "belongs_to",
      from: "id_account",
      to: {
        model: "auth_account",
        column: "id",
      },
    },
    auth_users: {
      type: "has_many",
      from: "id",
      to: {
        model: "auth_user",
        column: "id_author",
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
    }
  },
} as const satisfies ModelDefinition<"author">;