import type { ModelDefinition } from "rlib/server";

export default {
  table: "landing",
  columns: {
    id: {
      type: "text",
    },
    slug: {
      type: "text",
    },
    views: {
      type: "number",
    },
    deleted_at: {
      type: "datetime",
    },
    status: {
      type: "text",
    },
    title: {
      type: "text",
    }
  },
  relations: {
    landing_itemss: {
      type: "has_many",
      from: "id",
      to: {
        model: "landing_items",
        column: "landing_id",
      },
    }
  },
} as const satisfies ModelDefinition<"landing">;