import type { ModelDefinition } from 'rlib';

export default {
  table: "t_sales",
  columns: {
    id: {
      type: "text",
    },
    id_customer: {
      type: "text",
    },
    status: {
      type: "text",
    },
    total: {
      type: "number",
    },
    currency: {
      type: "text",
    },
    info: {
      type: "json",
    },
    created_at: {
      type: "datetime",
    },
    updated_at: {
      type: "datetime",
    },
    deleted_at: {
      type: "datetime",
    },
    midtrans_order_id: {
      type: "text",
    },
    midtrans_success: {
      type: "json",
    },
    midtrans_pending: {
      type: "json",
    },
    midtrans_error: {
      type: "json",
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
    },
    sales_lines: {
      type: "has_many",
      from: "id",
      to: {
        model: "t_sales_line",
        column: "id_sales",
      },
    }
  },
} as const satisfies ModelDefinition<"t_sales">;