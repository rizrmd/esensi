import type { ModelDefinition } from "rlib/server";

export default {
  table: "customer_track",
  columns: {
    id: {
      type: "text",
    },
    ts: {
      type: "datetime",
    },
    id_customer: {
      type: "text",
    },
    path: {
      type: "text",
    },
    referrer: {
      type: "text",
    },
    info: {
      type: "json",
    },
    ip: {
      type: "text",
    }
  },
  relations: {
    customer: {
      type: "belongs_to",
      from: "id_customer",
      to: {
        model: "customer",
        column: "id",
      },
    }
  },
} as const satisfies ModelDefinition<"customer_track">;