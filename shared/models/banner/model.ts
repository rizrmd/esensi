import type { ModelDefinition } from 'rlib';

export default {
  table: "banner",
  columns: {
    id: {
      type: "text",
    },
    title: {
      type: "text",
    },
    banner_file: {
      type: "text",
    },
    status: {
      type: "text",
    },
    deleted_at: {
      type: "datetime",
    },
    link: {
      type: "text",
    }
  },
  relations: {},
} as const satisfies ModelDefinition<"banner">;