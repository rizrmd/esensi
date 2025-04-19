import type { ModelDefinition } from "rlib/server";

export default {
  table: "t_sales_download",
  columns: {
    id: {
      type: "text",
    },
    id_product: {
      type: "text",
    },
    id_customer: {
      type: "text",
    },
    downloaded_at: {
      type: "datetime",
    },
    ip_address: {
      type: "text",
    },
    download_key: {
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
    },
    product: {
      type: "belongs_to",
      from: "id_product",
      to: {
        model: "product",
        column: "id",
      },
    }
  },
} as const satisfies ModelDefinition<"t_sales_download">;