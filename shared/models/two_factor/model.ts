import type { ModelDefinition } from 'rlib';

export default {
  table: "two_factor",
  columns: {
    id: {
      type: "text",
    },
    secret: {
      type: "text",
    },
    backup_codes: {
      type: "text",
    },
    user_info_id: {
      type: "text",
    }
  },
  relations: {
    user_info: {
      type: "belongs_to",
      from: "user_info_id",
      to: {
        model: "user_info",
        column: "id",
      },
    }
  },
} as const satisfies ModelDefinition<"two_factor">;