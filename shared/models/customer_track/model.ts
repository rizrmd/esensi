import type { ModelDefinition } from 'rlib';

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
    customer_track: {
      type: "belongs_to",
      from: "id_customer",
      to: {
        model: "customer_track",
        column: "id",
      },
    },
    customer_tracks: {
      type: "has_many",
      from: "id",
      to: {
        model: "customer_track",
        column: "id_customer",
      },
    }
  },
} as const satisfies ModelDefinition<"customer_track">;