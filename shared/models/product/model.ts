import type { ModelDefinition } from 'rlib';

export default {
  table: "product",
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
    alias: {
      type: "text",
    },
    strike_price: {
      type: "number",
    },
    real_price: {
      type: "number",
    },
    desc: {
      type: "text",
    },
    info: {
      type: "json",
    },
    status: {
      type: "text",
    },
    currency: {
      type: "text",
    },
    deleted_at: {
      type: "datetime",
    },
    img_file: {
      type: "text",
    },
    cover: {
      type: "text",
    },
    product_file: {
      type: "text",
    },
    sku: {
      type: "text",
    },
    id_author: {
      type: "text",
    },
    published_date: {
      type: "datetime",
    },
    is_physical: {
      type: "boolean",
    },
    ai_suggested_content: {
      type: "json",
    },
    preorder_min_qty: {
      type: "number",
    },
    content_type: {
      type: "text",
    }
  },
  relations: {
    author: {
      type: "belongs_to",
      from: "id_author",
      to: {
        model: "author",
        column: "id",
      },
    },
    bundle_products: {
      type: "has_many",
      from: "id",
      to: {
        model: "bundle_product",
        column: "id_product",
      },
    },
    customer_readers: {
      type: "has_many",
      from: "id",
      to: {
        model: "customer_reader",
        column: "id_product",
      },
    },
    preorders: {
      type: "has_many",
      from: "id",
      to: {
        model: "preorder",
        column: "id_product",
      },
    },
    product_categorys: {
      type: "has_many",
      from: "id",
      to: {
        model: "product_category",
        column: "id_product",
      },
    },
    sales_downloads: {
      type: "has_many",
      from: "id",
      to: {
        model: "t_sales_download",
        column: "id_product",
      },
    },
    sales_lines: {
      type: "has_many",
      from: "id",
      to: {
        model: "t_sales_line",
        column: "id_product",
      },
    }
  },
} as const satisfies ModelDefinition<"product">;