import type { ModelDefinition } from "rlib/server";

export default {
  table: "t_sales_line",
  columns: {
    id: {
      type: "text",
    },
    id_sales: {
      type: "text",
    },
    unit_price: {
      type: "number",
    },
    qty: {
      type: "number",
    },
    total_price: {
      type: "number",
    },
    id_product: {
      type: "text",
    },
    id_bundle: {
      type: "text",
    }
  },
  relations: {
    bundle: {
      type: "belongs_to",
      from: "id_bundle",
      to: {
        model: "bundle",
        column: "id",
      },
    },
    product: {
      type: "belongs_to",
      from: "id_product",
      to: {
        model: "product",
        column: "id",
      },
    },
    sales: {
      type: "belongs_to",
      from: "id_sales",
      to: {
        model: "t_sales",
        column: "id",
      },
    }
  },
} as const satisfies ModelDefinition<"t_sales_line">;