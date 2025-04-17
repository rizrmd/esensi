import type { ModelDefinition } from 'rlib';

export default {
  table: "promo_code",
  columns: {
    id: {
      type: "text",
    },
    code: {
      type: "text",
    },
    discount_type: {
      type: "text",
    },
    discount_value: {
      type: "number",
    },
    valid_from: {
      type: "datetime",
    },
    valid_to: {
      type: "datetime",
    },
    usage_limit: {
      type: "number",
    },
    used_count: {
      type: "number",
    },
    status: {
      type: "text",
    },
    id_publisher: {
      type: "text",
    }
  },
  relations: {
    publisher: {
      type: "belongs_to",
      from: "id_publisher",
      to: {
        model: "publisher",
        column: "id",
      },
    }
  },
} as const satisfies ModelDefinition<"promo_code">;