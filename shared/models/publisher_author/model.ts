import type { ModelDefinition } from 'rlib';

export default {
  table: "publisher_author",
  columns: {
    id: {
      type: "text",
    },
    publisher_id: {
      type: "text",
    },
    author_id: {
      type: "text",
    }
  },
  relations: {
    author: {
      type: "belongs_to",
      from: "author_id",
      to: {
        model: "author",
        column: "id",
      },
    },
    publisher: {
      type: "belongs_to",
      from: "publisher_id",
      to: {
        model: "publisher",
        column: "id",
      },
    }
  },
} as const satisfies ModelDefinition<"publisher_author">;