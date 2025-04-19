import type { ModelDefinition } from "rlib/server";

export default {
  table: "bundle",
  columns: {
    id: {
      type: "text",
    },
    name: {
      type: "text",
    },
    slug: {
      type: "text",
    },
    strike_price: {
      type: "number",
    },
    real_price: {
      type: "number",
    },
    currency: {
      type: "text",
    },
    desc: {
      type: "text",
    },
    info: {
      type: "json",
    },
    deleted_at: {
      type: "datetime",
    },
    status: {
      type: "text",
    },
    img_file: {
      type: "text",
    },
    cover: {
      type: "text",
    },
    sku: {
      type: "text",
    }
  },
  relations: {
    bundle_categorys: {
      type: "has_many",
      from: "id",
      to: {
        model: "bundle_category",
        column: "id_bundle",
      },
    },
    bundle_products: {
      type: "has_many",
      from: "id",
      to: {
        model: "bundle_product",
        column: "id_bundle",
      },
    },
    sales_lines: {
      type: "has_many",
      from: "id",
      to: {
        model: "t_sales_line",
        column: "id_bundle",
      },
    }
  },
} as const satisfies ModelDefinition<"bundle">;