import type { ModelDefinition } from 'rlib';

export default {
  table: "landing_items",
  columns: {
    id: {
      type: "text",
    },
    desc: {
      type: "text",
    },
    img_file: {
      type: "text",
    },
    tag: {
      type: "text",
    },
    link_to: {
      type: "text",
    },
    landing_id: {
      type: "text",
    },
    idx: {
      type: "number",
    },
    color: {
      type: "text",
    }
  },
  relations: {
    landing: {
      type: "belongs_to",
      from: "landing_id",
      to: {
        model: "landing",
        column: "id",
      },
    }
  },
} as const satisfies ModelDefinition<"landing_items">;